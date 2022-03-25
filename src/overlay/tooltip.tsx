import Ogma, { Point, Size, Overlay } from "@linkurious/ogma";
import { FC, ReactNode, useEffect, useState, ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { useOgma } from "../context";

type PositionGetter = (ogma: Ogma) => Point | null;

type Content =
  | string
  | ReactElement
  | ((ogma: Ogma, position: Point) => ReactElement);

export interface TooltipProps {
  id?: string;
  position: Point | PositionGetter;
  content?: Content;
  size?: Size;
  sticky?: boolean;
  placement?: "top" | "bottom" | "left" | "right" | "center";
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
  placement = "center",
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
