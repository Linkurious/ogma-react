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
  size = { width: 100, height: "auto" } as any as Size,
  children,
  placement = "center",
  tooltipClass = "ogma-tooltip",
}) => {
  const ogma = useOgma();
  const [tooltip, setTooltip] = useState<Overlay | null>(null);
  const [newPosition, setNewPosition] = useState<Point>({ x: 0, y: 0 });
  const [newHtml, setNewHtml] = useState<string>(
    `<div class="${getContainerClass(tooltipClass, placement)}"/>`
  );

  useEffect(() => {
    if (!tooltip) {
      console.log(newHtml);
      const tooltipLayer = ogma.layers.addOverlay({
        position: newPosition,
        element: newHtml,
        size,
        scaled: false,
      });
      // @ts-ignore
      //window.tooltipLayer = tooltipLayer;
      // const TooltipNew = new Tooltip({
      // });
      // const htmlString = renderToString(children as any);
      // TooltipNew.setLngLat(position).setHTML(htmlString).addTo(ogma);
      setTooltip(tooltipLayer);
      // setNewPosition(position);
      // setNewHtml(htmlString);
      console.log("ttp created");
    }

    return () => {
      if (tooltip) tooltip.destroy();
    };
  }, [tooltip, setTooltip, setNewPosition, setNewHtml]);

  useEffect(() => {
    const pos = getPosition(position, ogma);
    console.log(pos);
    // if (pos === null) tooltip.hide();
    // else tooltip.show().setPosition(pos);
    // if (typeof position === "function") {
    //   const pos = position(ogma);
    //   if (pos) setNewPosition(pos);
    // } else setNewPosition(position);

    if (tooltip) tooltip.show().setPosition(newPosition);
    //tooltip.setPosition(newPosition);
  }, [tooltip, position, newPosition, content]);

  if (tooltip) {
    const html = getContent(ogma, newPosition, content, children);
    if (html !== newHtml) {
      console.log("render", html);
      setNewHtml(html);
      tooltip.element.innerHTML = html;
    }

    if (position !== newPosition) {
      const pos = getPosition(position, ogma);
      if (pos === null) tooltip.hide();
      else tooltip.show().setPosition(pos);
    }
  }

  return null;
};
