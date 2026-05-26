import { ReactElement, ReactNode } from "react";
import { Ogma as OgmaLib, Edge, Node, Point } from "@linkurious/ogma";

export type Placement = "top" | "bottom" | "left" | "right" | "center";

export type PositionGetter = (ogma: OgmaLib) => Point | null;

export type Content =
  | string
  | ReactElement
  | ((ogma: OgmaLib, position: Point | null) => ReactElement);

export type TooltipEventFunctions = {
  edgeHover: (target: Edge) => ReactNode;
  nodeHover: (target: Node) => ReactNode;
};
