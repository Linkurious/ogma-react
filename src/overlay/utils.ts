import { ReactNode, ReactElement } from "react";
import { renderToString } from "react-dom/server";
import OgmaLib, { Point } from "@linkurious/ogma";
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
