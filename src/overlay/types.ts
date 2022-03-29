import { ReactElement } from "react";
import OgmaLib, { Point } from "@linkurious/ogma";

export type Placement = "top" | "bottom" | "left" | "right" | "center";

export type PositionGetter = (ogma: OgmaLib) => Point | null;

export type Content =
  | string
  | ReactElement
  | ((ogma: OgmaLib, position: Point) => ReactElement);
