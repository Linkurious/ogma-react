import { ReactElement, ReactNode } from "react";
import { Ogma as OgmaLib, Edge, Node, Point } from "@linkurious/ogma";

export type Placement = "top" | "bottom" | "left" | "right" | "center";

export type PositionGetter = (ogma: OgmaLib) => Point | null;

export type Content =
  | string
  | ReactElement
  | ((ogma: OgmaLib, position: Point | null) => ReactElement);

export type TooltipEventFunctions = {
  backgroundClick: (target: Point) => ReactNode;
  backgroundDoubleclick: (target: Point) => ReactNode;
  backgroundRightclick: (target: Point) => ReactNode;
  edgeClick: (target: Edge) => ReactNode;
  edgeDoubleclick: (target: Edge) => ReactNode;
  edgeHover: (target: Edge) => ReactNode;
  edgeRightclick: (target: Edge) => ReactNode;
  nodeClick: (target: Node) => ReactNode;
  nodeDoubleclick: (target: Node) => ReactNode;
  nodeHover: (target: Node) => ReactNode;
  nodeRightclick: (target: Node) => ReactNode;
};
