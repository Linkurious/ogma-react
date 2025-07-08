import {
  useEffect,
  useState,
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
import {
  getContainerClass,
  getEventNameFromTooltipEvent
} from "./utils";
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

  children?: ReactNode | TooltipEventFunctions[K];
}

const offScreenPos: Point = { x: -9999, y: -9999 };

const TooltipComponent = <K extends keyof TooltipEventFunctions>(
  {
    eventName,
    position,
    children,
    placement = "top",
    bodyClass = "",
    size,
  }: TooltipProps<K>,
  ref?: Ref<OverlayLayer>
) => {
  const ogma = useOgma();
  const [target, setTarget] = useState<OgmaNode | Edge | Point>();
  const [layer, setLayer] = useState<OverlayLayer | null>(null);

  useImperativeHandle(ref, () => layer as OverlayLayer, [layer]);

  function showTooltip(point: Point) {
    // If the position is not set, use the point provided
    if (! position) layer?.setPosition(point);

    layer?.show();
  }

  function hideTooltip() {
    layer?.hide();
    setTarget(undefined);
  }

  // Initialize the tooltip layer when the component mounts
  useEffect(() => {

    // Create initial empty content container
    const currentLayer = ogma.layers.addOverlay({
      position: position ? position : offScreenPos,
      element: `
      <div class="${getContainerClass("ogma-popup", placement)}">
        <div class="ogma-popup--body ${bodyClass}">
        </div>
      </div>`,
      size: size || { width: "auto", height: "auto" },
      scaled: false
    });
    setLayer(currentLayer);

  }, []);

  // Set up event listeners for the tooltip layer when it changes
  useEffect(() => {
    if (! layer) return;

    let onEvent: (evt: any) => void = () => null;
    let onUnevent: (evt: any) => void = () => null;

    const event = getEventNameFromTooltipEvent(eventName);
    if (event === "mouseover") {
      onEvent = (evt: MouseOverEvent<unknown, unknown>) => {
        if (eventName.startsWith("node")) {
          if (evt.target?.isNode) {
            const node = evt.target;
            setTarget(node);
            showTooltip(node.getPosition());
          }
        } else if (eventName.startsWith("edge")) {
          if (evt.target && ! evt.target.isNode) {
            // Show the tooltip in the middle of the extremities
            const nodes = evt.target.getExtremities();
            const middle = {
              x: (nodes.get(0).getPosition().x + nodes.get(1).getPosition().x) / 2,
              y: (nodes.get(0).getPosition().y + nodes.get(1).getPosition().y) / 2
            }
            setTarget(evt.target);
            showTooltip(middle);
          }
        }
      };
      onUnevent = (evt) => {
        // Hide the tooltip when mouse leaves the target
        if (eventName.startsWith("node") && evt.target?.isNode) {
          hideTooltip();
        } else if (eventName.startsWith("edge")) {
          if (evt.target && ! evt.target.isNode) {
            hideTooltip();
          }
        }
      }
      ogma.events.on("mouseout", onUnevent);
    } else {
      // Click events
      onEvent = (evt) => {
        // Check if the event name corresponds to the actual event
        if (eventName.endsWith("Rightclick") && evt.button === "left") {
          return;
        }
        if (eventName.startsWith("background")) {
          if (! evt.target) {
            const pos = ogma.view.screenToGraphCoordinates({x: evt.x, y: evt.y});
            setTarget(pos);
            showTooltip(pos);
          }
        } else if (eventName.startsWith("node")) {
          if (evt.target?.isNode) {
            const node = evt.target;
            setTarget(node)
            showTooltip(node.getPosition());
          }
        } else {
          if (evt.target && ! evt.target.isNode) {
            // Show the tooltip in the middle of the extremities
            const nodes = evt.target.getExtremities();
            const middle = {
              x: (nodes.get(0).getPosition().x + nodes.get(1).getPosition().x) / 2,
              y: (nodes.get(0).getPosition().y + nodes.get(1).getPosition().y) / 2
            }
            setTarget(evt.target);
            showTooltip(middle);
          }
        }
      };
      onUnevent = (evt) => {
        // Hide the tooltip when a click is somewhere that's not the target
        if (eventName.startsWith("node")) {
          if (! evt.target?.isNode) {
            hideTooltip();
          }
        } else if (eventName.startsWith("edge")) {
          if (! evt.target || evt.target.isNode) {
            hideTooltip();
          }
        } else if (eventName.startsWith("background")) {
          if (evt.target) {
            hideTooltip();
          }
        }
      }
      ogma.events.on("click", onUnevent);
    }

    layer.hide();
    ogma.events.on(event, onEvent);

    return () => {
      ogma.events.off(onEvent);
      ogma.events.off(onUnevent);
      if (layer) {
        layer.destroy();
        setLayer(null);
      }
    }
  }, [layer]);

  useEffect(() => {
    if (! layer || ! layer.element) return;

    if (position) {
      // Update the position of the layer if it exists
      layer.setPosition(position);
    }
    if (placement || bodyClass) {
      // Update the class of the layer based on the placement
      layer.element.firstElementChild!.className = "ogma-popup--body " + bodyClass;
    }
    if (size) {
      // Update the size of the layer if it exists
      layer.setSize(size);
    }
  }, [position, placement, size, bodyClass]);

  // Render children through portal if they exist, otherwise render nothing
  if (!layer || !layer.element) return null;

  if (children instanceof Function) {
    if (! target) return null;
    // @ts-expect-error
    const content = children(target);
    if (content === null) {
      layer.hide()
      return null;
    }; 
    return createPortal(content, layer.element.firstElementChild!);
  } else {
    return children ? createPortal(children, layer.element.firstElementChild!) : null;
  }

};

type TooltipComponentType = <
  K extends keyof TooltipEventFunctions
>(
  props: TooltipProps<K> & React.RefAttributes<OverlayLayer>
) => React.ReactElement | null;

/**
 * A popup component.
 * Use it to display information statically on top of your visualisation
 * or to display a modal dialog.
 */
export const Tooltip = forwardRef(TooltipComponent) as TooltipComponentType;
