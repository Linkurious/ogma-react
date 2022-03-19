import Ogma, { Point } from "@linkurious/ogma";
import { FC, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { withOgma } from "./context";

export interface TooltipProps {
  id?: string;
  position: Point;
  ogma: Ogma;
}

const TooltipComponent: FC<TooltipProps> = ({
  //id = uuidv4(),
  position,
  //ogma,
  children,
}) => {
  const [Tooltip, setTooltip] = useState<any>(null);
  const [newPosition, setNewPosition] = useState<Point | undefined>(undefined);
  const [newHtml, setNewHtml] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!Tooltip) {
      // const TooltipNew = new Tooltip({
      // });
      // const htmlString = renderToString(children as any);
      // TooltipNew.setLngLat(position).setHTML(htmlString).addTo(ogma);
      // setTooltip(TooltipNew);
      // setNewPosition(position);
      // setNewHtml(htmlString);
    }

    return () => {
      if (Tooltip) Tooltip.remove();
    };
  }, [Tooltip, setTooltip, setNewPosition, setNewHtml]);

  if (Tooltip) {
    const htmlString = renderToString(children as any);
    if (htmlString !== newHtml) {
      // setNewHtml(htmlString);
      // Tooltip.setHTML(htmlString);
      // // console.log({ htmlString, newHtml });
    } else if (position !== newPosition) {
      // setNewPosition(position);
      // Tooltip.setLngLat(newPosition);
    }
  }

  return null;
};

export const Tooltip = withOgma<TooltipProps>(TooltipComponent);
