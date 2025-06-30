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
  /** Overlay container className */
  popupClass?: string;

  children?: ReactNode | TooltipEventFunctions[K];
}

const POPUP_CLASS = "ogma-popup";
const offScreenPos: Point = { x: -9999, y: -9999 };

const TooltipComponent = <K extends keyof TooltipEventFunctions>(
  {
    eventName,
    position,
    children,
    placement = "top",
    popupClass = POPUP_CLASS,
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

  // Initialize the tooltip layer when the component mounts
  useEffect(() => {

    // Create initial empty content container
    const currentLayer = ogma.layers.addOverlay({
      position: position ? position : offScreenPos,
      element: `<div class="${getContainerClass(popupClass, placement)}"></div>`,
      size: size || { width: "auto", height: "auto" },
      scaled: false
    });
    setLayer(currentLayer);

  }, []);

  // Set up event listeners for the tooltip layer when it changes
  useEffect(() => {
    if (! layer) return;

    let onEvent: (evt?: any) => void = () => null;
    let onUnevent: (evt?: any) => void = () => null;

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
          if (evt.target && !evt.target.isNode) {
            // Show the tooltip in the middle of the extrimities
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
        if (eventName.startsWith("node") && evt.target?.isNode) {
          // Hide the tooltip when mouse leaves the node
          layer.hide();
        } else if (eventName.startsWith("edge")) {
          if (evt.target && !evt.target.isNode) {
            // Hide the tooltip when mouse leaves the edge
            layer.hide();
          }
        }
      }
      ogma.events.on("mouseout", onUnevent);
    }
    else {
      onEvent = (evt) => {
        // Check if the event name corresponds to the actual event
        if (eventName.endsWith("RightClick") && evt.button === "left") {
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
          if (! evt.target?.isNode) {
            // Show the tooltip in the middle of the extrimities
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
        // Hide the tooltip when mouse clicks somewhere that's not the target
        if (eventName.endsWith("RightClick") && evt.button === "left") {
          layer.hide();
          return;
        }
        if (eventName.startsWith("node")) {
          if (! evt.target?.isNode) {
            layer.hide();
          }
        } else if (eventName.startsWith("edge")) {
          if (! evt.target && evt.target.isNode) {
            layer.hide();
          }
        } else if (eventName.startsWith("background")) {
          if (evt.target) {
            layer.hide();
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
    if (! layer) return;

    if (position) {
      // Update the position of the layer if it exists
      layer.setPosition(position);
    }
    if (placement || popupClass) {
      // Update the class of the layer based on the placement
      layer.element.className = getContainerClass(popupClass, placement);
    }
    if (size) {
      // Update the size of the layer if it exists
      layer.setSize(size);
    }
  }, [position, placement, size, popupClass]);

  // Render children through portal if they exist, otherwise render nothing
  if (!layer ) return null;

  if (children instanceof Function)
    // @ts-expect-error
    return target ? createPortal(children(target), layer.element) : null;
  else 
    return children ? createPortal(children, layer.element) : null;

};

/**
 * A popup component.
 * Use it to display information statically on top of your visualisation
 * or to display a modal dialog.
 */
export const Tooltip = forwardRef(TooltipComponent);
