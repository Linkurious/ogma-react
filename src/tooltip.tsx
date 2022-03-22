import Ogma, { Point, Size, Overlay } from "@linkurious/ogma";
import { FC, ReactNode, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { useOgma, withOgma } from "./context";

type PositionGetter = (ogma: Ogma) => Point | null;

type Content =
  | string
  | JSX.Element
  | ((ogma: Ogma, position: Point) => JSX.Element);

export interface TooltipProps {
  id?: string;
  position: Point | PositionGetter;
  content?: Content;
  size?: Size;
}

function getContent(
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

function getPosition(position: Point | PositionGetter, ogma: Ogma) {
  if (typeof position === "function") return position(ogma);
  return position;
}

export const Tooltip: FC<TooltipProps> = ({
  //id = uuidv4(),
  content,
  position,
  size = { width: 100, height: "auto" } as any as Size,
  children,
}) => {
  const ogma = useOgma();
  const [tooltip, setTooltip] = useState<Overlay | null>(null);
  const [newPosition, setNewPosition] = useState<Point>({ x: 0, y: 0 });
  const [newHtml, setNewHtml] = useState<string>(`<div class="ogma-tooltip"/>`);

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
    if (typeof position === "function") {
      const pos = position(ogma);
      if (pos) setNewPosition(pos);
    } else setNewPosition(position);

    if (tooltip) tooltip.setPosition(newPosition);
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
