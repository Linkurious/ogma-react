import { ReactNode, ReactElement } from "react";
import { renderToString } from "react-dom/server";
import OgmaLib, { Node as OgmaNode, Edge, Point } from "@linkurious/ogma";
import { Content, PositionGetter, Placement, TooltipEventFunctions } from "./types";

export function getContent(
  ogma: OgmaLib,
  position: Point,
  content?: Content,
  children?: ReactNode
): string {
  if (typeof content === "string") return content;
  else if (typeof content === "function")
    return renderToString(content(ogma, position));
  return renderToString(children as any);
}

export function getPosition(position: Point | PositionGetter, ogma: OgmaLib) {
  if (typeof position === "function") return position(ogma);
  return position;
}

export const getContainerClass = (popupClass: string, placement: Placement) =>
  `${popupClass} ${popupClass}--${placement}`;

export function getCloseButton(
  closeButton: string | ReactNode | null = "&times;",
  closeButtonClass: string
) {
  if (closeButton) {
    const closeButtonElement =
      typeof closeButton === "string"
        ? closeButton
        : renderToString(closeButton as ReactElement);
    return `<div class=${closeButtonClass}>${closeButtonElement}</div>`;
  }
  return "";
}

export function getEventNameFromTooltipEvent(eventName: keyof TooltipEventFunctions): "mouseover" | "click" | "doubleclick" {
  if (eventName.endsWith("Doubleclick")) {
    return "doubleclick";
  // Take into account click and rightclick events
  } else if (eventName.toLowerCase().endsWith("click")) {
    return "click";
  } else {
    return "mouseover";
  }
}

function getOffsetAmount(target: OgmaNode | Edge | "background", zoom: number): number {
  // Get the offset amount based on the target type

  if (target instanceof OgmaNode) {
    const radius = target.getAttribute("radius") as number;
    const outerStrokeWidth = getStrokeWidth("outer", target, zoom);
    const innerStrokeWidth = getStrokeWidth("inner", target, zoom);
    return radius + outerStrokeWidth + innerStrokeWidth; // Offset for nodes
  } else if (target instanceof Edge) {
    return target.size; // Offset for edges
  }
  return 0; // No offset for background
}

function getStrokeWidth(strokeType: "inner" | "outer", target: OgmaNode | Edge, zoom: number) {
  // Get the stroke width based on the type and zoom level
  // @ts-expect-error the attribute does exist
  const strokeWidth = target.getAttribute(`${strokeType}Stroke.width`) as number;
  // @ts-expect-error the attribute does exist
  if (! target.getAttribute(`${strokeType}Stroke.minVisibleSize`) < target.size) return 0;

  // @ts-expect-error the attribute does exist
  if (target.getAttribute(`${strokeType}Stroke.scalingMethod`) === "fixed") {
    return strokeWidth; // Fixed stroke width
  } else {
    return strokeWidth / zoom; // Scale the stroke width based on the zoom level
  }
}

export function getOffset(target: OgmaNode | Edge | "background", zoom: number, placement: Placement): Point {
  // Get the offset of the layer based on the placement
  const offsetAmount = getOffsetAmount(target, zoom);
  const offset = { x: 0, y: 0 };
  switch (placement) {
    case "top":
      offset.y = -offsetAmount;
      break;
    case "bottom":
      offset.y = offsetAmount;
      break;
    case "left":
      offset.x = -offsetAmount;
      break;
    case "right":
      offset.x = offsetAmount;
      break;
  }
  return offset;
}

export function isOverflowing(bb: DOMRect, clientWidth: number, clientHeight: number) {
  if (bb.left < 0) {
    return "right";
  }
  if (bb.right > clientWidth) {
    return "left";
  }
  if (bb.top < 0) {
    return "bottom";
  }
  if (bb.bottom > clientHeight) {
    return "top";
  }
  return null;
}

export function getTranslate(newPlacement: Placement | null, placement: Placement, translate: {x: number, y: number}) {
  switch (newPlacement || placement) {
    case "top":
      return `translate(calc(-50% + ${translate.x}px), calc(-100% + ${translate.y}px))`;
    case "bottom":
      return `translate(calc(-50% + ${translate.x}px), ${translate.y}px)`;
    case "left":
      return `translate(calc(-100% + ${translate.x}px), calc(-50% + ${translate.y}px))`;
    default:
      return `translate(${translate.x}px, calc(-50% + ${translate.y}px))`;
  }
}