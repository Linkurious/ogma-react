import { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import Ogma, { Point } from "@linkurious/ogma";
import { Content, PositionGetter } from "./types";

export function getContent(
  ogma: Ogma,
  position: Point,
  content?: Content,
  children?: ReactNode
): string {
  if (typeof content === "string") return content;
  else if (typeof content === "function")
    return renderToString(content(ogma, position));
  return renderToString(children as any);
}

export function getPosition(position: Point | PositionGetter, ogma: Ogma) {
  if (typeof position === "function") return position(ogma);
  return position;
}
