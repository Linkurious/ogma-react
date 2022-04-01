import OgmaLib, { Point, Size, Overlay } from "@linkurious/ogma";
import { FC, useEffect, useState, ReactElement } from "react";
import { useOgma } from "../context";
import { Placement } from "./types";
import { getContainerClass, getContent, getPosition } from "./utils";

type PositionGetter = (ogma: OgmaLib) => Point | null;

type Content =
  | string
  | ReactElement
  | ((ogma: OgmaLib, position: Point) => ReactElement);

export interface TooltipProps {
  id?: string;
  position: Point | PositionGetter;
  content?: Content;
  size?: Size;
  sticky?: boolean;
  placement?: Placement;
  tooltipClass?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  //id = uuidv4(),
  content,
  position,
  size = { width: "auto", height: "auto" } as any as Size,
  children,
  placement = "right",
  tooltipClass = "ogma-tooltip",
}) => {
  const ogma = useOgma();
  const [tooltip, setTooltip] = useState<Overlay | null>(null);
  const [newPosition, setNewPosition] = useState<Point>({ x: 0, y: 0 });
  const [newHtml, setNewHtml] = useState<string>(
    `<div class="${getContainerClass(
      tooltipClass,
      placement
    )}"><div class="${tooltipClass}--content" /></div>`
  );

  useEffect(() => {
    if (!tooltip) {
      const tooltipLayer = ogma.layers.addOverlay({
        position: newPosition,
        element: newHtml,
        size,
        scaled: false,
      });
      setTooltip(tooltipLayer);
    }

    return () => {
      if (tooltip) tooltip.destroy();
    };
  }, [tooltip, setTooltip, setNewPosition, setNewHtml]);

  useEffect(() => {
    const pos = getPosition(position, ogma);
    if (tooltip) tooltip.show().setPosition(newPosition);
    //tooltip.setPosition(newPosition);
  }, [tooltip, position, newPosition, content]);

  if (tooltip) {
    const html = getContent(ogma, newPosition, content, children);
    if (html !== newHtml) {
      console.log("render", html);
      setNewHtml(html);
      tooltip.element.firstElementChild!.innerHTML = html;
    }

    if (position !== newPosition) {
      const pos = getPosition(position, ogma);
      if (pos === null) tooltip.hide();
      else tooltip.show().setPosition(pos);
    }
  }

  return null;
};
