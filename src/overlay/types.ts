import { ReactElement, ReactNode } from "react";
import OgmaLib, { Edge, Node, Point } from "@linkurious/ogma";

export type Placement = "top" | "bottom" | "left" | "right" | "center";

export type PositionGetter = (ogma: OgmaLib) => Point | null;

export type Content =
  | string
  | ReactElement
  | ((ogma: OgmaLib, position: Point | null) => ReactElement);

export type TooltipEventFunctions = {
  "backgroundClick": (target: Point) => ReactNode,
  "backgroundDoubleClick": (target: Point) => ReactNode,
  "backgroundRightClick": (target: Point) => ReactNode,
  "edgeClick": (target: Edge) => ReactNode,
  "edgeDoubleClick": (target: Edge) => ReactNode,
  "edgeHover": (target: Edge) => ReactNode,
  "edgeRightClick": (target: Edge) => ReactNode,
  "nodeClick": (target: Node) => ReactNode,
  "nodeDoubleClick": (target: Node) => ReactNode,
  "nodeHover": (target: Node) => ReactNode,
  "nodeRightClick": (target: Node) => ReactNode
}

export type TooltipPosition = "top"|"bottom"|"left"|"right"|"cssDefined"

export type TooltipOptions = {
  position?: TooltipPosition;
  autoAdjust?: boolean;
  delay?: number;
  className?: string;
}