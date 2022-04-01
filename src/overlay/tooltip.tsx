import OgmaLib, {
  Point,
  Size,
  Overlay,
  //MouseMoveEvent,
} from "@linkurious/ogma";
import { FC, useEffect, useState, useRef } from "react";
import { useOgma } from "../context";
import { Placement, Content } from "./types";
import {
  getAdjustedPlacement,
  getContainerClass,
  getContent,
  getPosition,
} from "./utils";

type PositionGetter = (ogma: OgmaLib) => Point | null;

// type Content =
//   | string
//   | ReactElement
//   | ((ogma: OgmaLib, position: Point) => ReactElement);

/**
 * 1. in useEffect unconditionally, I create the tooltip
 * 2. i listen to ogma mousemove and update pos
 * 3. if there's an update of content, I re-render
 */

interface TooltipProps {
  id?: string;
  position: Point | PositionGetter;
  content?: Content;
  size?: Size;
  visible?: boolean;
  placement?: Placement;
  tooltipClass?: string;
}

export const Tooltip: FC<TooltipProps> = ({
  tooltipClass = "ogma-tooltip",
  placement = "right",
  position,
  size = { width: "auto", height: "auto" } as any as Size,
  children,
  content,
  visible = true,
}) => {
  const ogma = useOgma();
  const [layer, setLayer] = useState<Overlay>();
  const [coords, setCoords] = useState<Point | null>();
  const [html, setHtml] = useState("");
  const [dimensions, setDimensions] = useState<Size>();
  const raf = useRef<number>();

  // component is mounted
  useEffect(() => {
    const className = getContainerClass(tooltipClass, placement);
    const wrapperHtml = `<div class="${className}"><div class="${tooltipClass}--content" /></div>`;
    const newCoords = getPosition(position, ogma);
    setCoords(newCoords);
    const tooltip = ogma.layers.addOverlay({
      position: newCoords || { x: -9999, y: -9999 },
      element: wrapperHtml,
      scaled: false,
      size,
    });
    setLayer(tooltip);
    return () => {
      tooltip.destroy();
    };
  }, []);

  // content or position has changed
  useEffect(() => {
    const newContent = getContent(ogma, coords!, content, children);
    //console.log("re-render", newContent, getPosition(position, ogma));
    if (layer) {
      if (newContent !== html) {
        layer.element.firstElementChild!.innerHTML = newContent;
        setHtml(newContent);
        setDimensions({
          width: layer.element.offsetWidth,
          height: layer.element.offsetHeight,
        });
        console.log();
      }
      const newCoords = getPosition(position, ogma);
      if (coords !== newCoords) {
        setCoords(newCoords);
      }
    }
    raf.current = requestAnimationFrame(() => {
      if (layer && coords && dimensions) {
        layer.element.className = getContainerClass(
          tooltipClass,
          getAdjustedPlacement(coords, placement, dimensions, ogma)
        );
        layer.setPosition(coords); // throttledSetPosition(coords);
      }
    });
    return () => cancelAnimationFrame(raf.current as number);
  }, [children, content, position, visible]);

  return null;
};
