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

  function showTooltip(target: OgmaNode | Edge | "background", point: Point) {
    // If the position is not set, use the point provided
    if (! position) {
      const offsetAmount = getOffsetAmount(target);
      const offset = getOffset(offsetAmount);
      const pos = {
        x: point.x + offset.x,
        y: point.y + offset.y
      };
      layer?.setPosition(pos);
    };

    layer?.show();
  }

  function getOffsetAmount(target: OgmaNode | Edge | "background") {
    // Get the offset amount based on the target type

    if (target instanceof OgmaNode) {
      const radius = target.getAttribute("radius") as number;
      const outerStrokeWidth = getStrokeWidth("outer", target);
      const innerStrokeWidth = getStrokeWidth("inner", target);
      return radius + outerStrokeWidth + innerStrokeWidth; // Offset for nodes
    } else if (target instanceof Edge) {
      return target.size; // Offset for edges
    }
    return 0; // No offset for background
  }

  function getStrokeWidth(strokeType: "inner" | "outer", target: OgmaNode | Edge) {
    // Get the stroke width based on the type and zoom level
    // @ts-expect-error the attribute does exist
    const strokeWidth = target.getAttribute(`${strokeType}Stroke.width`) as number;
    // @ts-expect-error the attribute does exist
    if (target.getAttribute(`${strokeType}Stroke.minVisibleSize`) < target.size) {
      // @ts-expect-error the attribute does exist
      if (target.getAttribute(`${strokeType}Stroke.scalingMethod`) !== "fixed") {
        return strokeWidth / ogma.view.getZoom(); // Scale the stroke width based on the zoom level
      } else {
        return strokeWidth; // Fixed stroke width
      }
    }
    return 0; // No stroke if not visible
  }

  function getOffset(offsetAmount: number) {
    // Get the offset of the layer based on the placement
    const offset = { x: 0, y: 0 };
    if (placement === "top") {
      offset.y = -offsetAmount;
    } else if (placement === "bottom") {
      offset.y = offsetAmount;
    } else if (placement === "left") {
      offset.x = -offsetAmount;
    } else if (placement === "right") {
      offset.x = offsetAmount;
    }
    return offset;
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
            showTooltip(node, node.getPosition());
          }
        } else if (eventName.startsWith("edge")) {
          if (evt.target && ! evt.target.isNode) {
            // Show the tooltip in the middle of the extremities
            const pos = ogma.view.screenToGraphCoordinates({x: evt.x, y: evt.y})
            setTarget(evt.target);
            showTooltip(evt.target, pos);
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
            const pos = ogma.view.screenToGraphCoordinates({ x: evt.x, y: evt.y });
            setTarget(pos);
            showTooltip("background", pos);
          }
        } else if (eventName.startsWith("node")) {
          if (evt.target?.isNode) {
            const node = evt.target;
            setTarget(node);
            showTooltip(node, node.getPosition());
          }
        } else {
          if (evt.target && ! evt.target.isNode) {
            // Show the tooltip in the middle of the extremities
            const pos = ogma.view.screenToGraphCoordinates({ x: evt.x, y: evt.y })
            setTarget(evt.target);
            showTooltip(evt.target, pos);
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
          } else if (eventName.endsWith("Rightclick") && evt.button === "left"
                  || eventName.endsWith("Click") && evt.button === "right") {
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
