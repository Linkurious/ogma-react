import { ReactNode, ReactElement } from "react";
import { renderToString } from "react-dom/server";
import OgmaLib, { Point, Size } from "@linkurious/ogma";
import { Content, PositionGetter, Placement } from "./types";

export function getContent(
  ogma: OgmaLib,
  position: Point,
  content?: Content,
  children?: ReactNode,
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
  closeButtonClass: string,
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

export function getAdjustedPlacement(
  coords: Point,
  placement: Placement,
  dimensions: Size,
  ogma: OgmaLib,
): Placement {
  const { width: screenWidth, height: screenHeight } = ogma.view.getSize();
  const { x, y } = ogma.view.graphToScreenCoordinates(coords);
  let res = placement;
  const { width, height } = dimensions;

  if (placement === "left" && x - width < 0) res = "right";
  else if (placement === "right" && x + width > screenWidth) res = "left";
  else if (placement === "bottom" && y + height > screenHeight) res = "top";
  else if (placement === "top" && y - height < 0) res = "bottom";

  if (res === "right" || res === "left") {
    if (y + height / 2 > screenHeight) res = "top";
    else if (y - height / 2 < 0) res = "bottom";
  } else {
    if (x + width / 2 > screenWidth) res = "left";
    else if (x - width / 2 < 0) res = "right";
  }

  return res;
}
