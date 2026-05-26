import {
  useEffect,
  useState,
  useRef,
  ReactNode,
  Ref,
  forwardRef,
  useImperativeHandle
} from "react";

import {
  Overlay as OverlayLayer,
  Size,
  Point,
  MouseOverEvent,
  Node as OgmaNode,
  Edge
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { getOffset, getTranslate, isOverflowing } from "./utils";
import { Placement, TooltipEventFunctions } from "./types";
import { createPortal } from "react-dom";

interface TooltipProps<K extends keyof TooltipEventFunctions> {
  /* Event name */
  eventName: K;
  /** Overlay position if static */
  position?: Point;
  /** Overlay size */
  size?: Size;
  /** Overlay placement relative to the position */
  placement?: Placement;
  /* The body's class */
  bodyClass?: string;
  /** The offset of the tooltip */
  translate?: {
    x: number;
    y: number;
  };
  /** The content of the tooltip, can be a function that returns a ReactNode */
  children?: ReactNode | TooltipEventFunctions[K];
}

const offScreenPos: Point = { x: -9999, y: -9999 };

const TooltipComponent = <
  K extends keyof TooltipEventFunctions,
  ND = unknown,
  ED = unknown
>(
  {
    eventName,
    position,
    children,
    placement = "top",
    bodyClass = "ogma-tooltip--body",
    translate = { x: 0, y: 0 },
    size
  }: TooltipProps<K>,
  ref?: Ref<OverlayLayer>
) => {
  const ogma = useOgma<ND, ED>();
  const [target, setTarget] = useState<OgmaNode<ND, ED> | Edge<ED, ND>>();
  // Ref-based mirror of `target` so event handler closures always see the
  // current value without needing to be re-registered on every hover change.
  const targetRef = useRef<OgmaNode<ND, ED> | Edge<ED, ND> | undefined>(
    undefined
  );
  const [point, setPoint] = useState<Point>();
  // Ref-based mirror of `point` for the same reason.
  const pointRef = useRef<Point | undefined>(undefined);
  const [layer, setLayer] = useState<OverlayLayer | null>(null);

  useImperativeHandle(ref, () => layer as OverlayLayer, [layer]);

  function showTooltip(_target: OgmaNode<ND, ED> | Edge<ED, ND>, point: Point) {
    // If the position is not set, use the point provided
    if (!position) {
      const zoom = ogma.geo.enabled()
        ? ogma.geo.getZoom()!
        : ogma.view.getZoom();
      const offset = getOffset("background", zoom, placement);

      // Apply offset only in the appropriate direction based on placement
      let pos = { x: point.x, y: point.y };
      if (placement === "top" || placement === "bottom") {
        pos.y = point.y + offset.y;
      } else if (placement === "left" || placement === "right") {
        pos.x = point.x + offset.x;
      } else if (placement === "center") {
        pos.x = point.x + offset.x;
        pos.y = point.y + offset.y;
      }

      pointRef.current = point;
      setPoint(point);
      layer?.setPosition(pos);
    } else {
      layer?.show();
    }

    const transform = getTranslate(null, placement, translate);
    const element = layer!.element.children[0] as HTMLElement;
    element.style.transform = transform;

    // Wait for the next tick to make it visible to avoid flickering
  }

  function hideTooltip() {
    targetRef.current = undefined;
    pointRef.current = undefined;
    layer?.hide();
    setTarget(undefined);
  }

  // Initialize the tooltip layer when the component mounts
  useEffect(() => {
    // Create initial empty content container
    const currentLayer = ogma.layers.addOverlay({
      position: position ? position : offScreenPos,
      element: `
      <div style="pointer-events: none">
        <div class="${bodyClass}" style="pointer-events: none">
        </div>
      </div>`,
      size: size || { width: "auto", height: "auto" },
      scaled: false
    });
    setLayer(currentLayer);
  }, []);

  // Set up event listeners for the tooltip layer when it changes
  useEffect(() => {
    if (!layer) return;

    (layer.element.firstElementChild as HTMLElement).style.pointerEvents =
      "none";

    let onEvent: (evt: any) => void = () => null;
    let onUnevent: (evt: any) => void = () => null;
    let onMouseMove: ((evt: any) => void) | null = null;

    const getMouseGraphPoint = (evt: { x: number; y: number }) =>
      ogma.view.screenToGraphCoordinates({
        x: evt.x,
        y: evt.y
      });

    const moveTooltipToMouse = (evt: { x: number; y: number }) => {
      const currentTarget = targetRef.current;
      if (!currentTarget || !layer || position) return;

      const mousePoint = getMouseGraphPoint(evt);
      const zoom = ogma.geo.enabled()
        ? ogma.geo.getZoom()!
        : ogma.view.getZoom();
      const offset = getOffset("background", zoom, placement);

      pointRef.current = mousePoint;
      setPoint({ ...mousePoint });
      layer.setPosition({
        x: mousePoint.x + offset.x,
        y: mousePoint.y + offset.y
      });
    };

    onEvent = (evt: MouseOverEvent<ND, ED>) => {
      if (eventName.startsWith("node")) {
        if (evt.target?.isNode) {
          const node = evt.target;
          const pos = getMouseGraphPoint(evt);
          targetRef.current = node;
          setTarget(node);
          showTooltip(node, pos);
        }
      } else if (eventName.startsWith("edge")) {
        if (evt.target && !evt.target.isNode) {
          // Show the tooltip where the mouse is currently at
          const pos = getMouseGraphPoint(evt);
          targetRef.current = evt.target;
          setTarget(evt.target);
          showTooltip(evt.target, pos);
        }
      }
    };
    onUnevent = (evt) => {
      // Hide the tooltip only when the mouse leaves the *same* target that
      // triggered the show. Without this check, rapidly moving across
      // multiple nodes/edges would fire a foreign mouseout and close the
      // tooltip prematurely.
      if (eventName.startsWith("node") && evt.target?.isNode) {
        if (evt.target === targetRef.current) hideTooltip();
      } else if (eventName.startsWith("edge")) {
        if (evt.target && !evt.target.isNode) {
          if (evt.target === targetRef.current) hideTooltip();
        }
      }
    };
    ogma.events.on("mouseout", onUnevent);

    onMouseMove = (evt) => {
      moveTooltipToMouse(evt);
    };
    ogma.events.on("mousemove", onMouseMove);

    layer.hide();
    ogma.events.on("mouseover", onEvent);

    return () => {
      ogma.events.off(onEvent);
      ogma.events.off(onUnevent);
      if (onMouseMove) {
        ogma.events.off(onMouseMove);
      }
      if (layer) {
        layer.destroy();
        setLayer(null);
      }
    };
  }, [layer]);

  useEffect(() => {
    if (!layer || !layer.element) return;

    if (position) {
      // Update the position of the layer if it exists
      layer.setPosition(position);
    }
    if (placement || bodyClass) {
      // Update the class of the layer based on the placement
      layer.element.firstElementChild!.className =
        "ogma-popup--body " + bodyClass;
    }
    if (size) {
      // Update the size of the layer if it exists
      layer.setSize(size);
    }
  }, [position, placement, size, bodyClass]);

  useEffect(() => {
    if (!layer || !layer.element || !target) return;

    const element = layer.element as HTMLElement;
    const bb = element.children[0].getBoundingClientRect();
    const window = element.ownerDocument.defaultView!;

    // Check if the tooltip is overflowing and adjust the placement if needed
    const newPlacement = isOverflowing(
      bb,
      window.innerWidth,
      window.innerHeight
    );
    if (newPlacement) {
      // Recalculate the offset with the new placement
      const zoom = ogma.geo.enabled()
        ? ogma.geo.getZoom()!
        : ogma.view.getZoom();
      const offset = getOffset("background", zoom, newPlacement);

      layer?.setPosition({
        x: point!.x + offset.x,
        y: point!.y + offset.y
      });

      // Update the transform of the element to reflect the new placement
      const transform = getTranslate(newPlacement, placement, translate);
      (element.children[0] as HTMLElement).style.transform = transform;
    }

    // Make the element visible after re-positioning to avoid flickering
    layer.show();
  }, [point]);

  // Render children through portal if they exist, otherwise render nothing
  if (!layer || !layer.element) return null;

  if (children instanceof Function) {
    if (!target) return null;
    // @ts-expect-error the target is always correct (only the type is not)
    const content = children(target);
    if (content === null) {
      layer.hide();
      return null;
    }
    return createPortal(content, layer.element.firstElementChild!);
  } else {
    return children
      ? createPortal(children, layer.element.firstElementChild!)
      : null;
  }
};

type TooltipComponentType = <_ND, _ED, K extends keyof TooltipEventFunctions>(
  props: TooltipProps<K> & React.RefAttributes<OverlayLayer>
) => React.ReactElement | null;

/**
 * Tooltip layer is a custom component to render some dynamic data on top of
 * your visualisation. The position adapts to the target of the event (or is static)
 * and is customisable. See in in action in our
[example](linkurious.github.io/ogma-react/)
 */
export const Tooltip = forwardRef(TooltipComponent) as TooltipComponentType;
