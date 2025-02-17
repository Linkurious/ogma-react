import OgmaLib, {
  Point,
  Size,
  Overlay as OverlayLayer,
} from "@linkurious/ogma";
import {
  useEffect,
  useState,
  useRef,
  ReactNode,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useOgma } from "../context";
import { Placement, Content } from "./types";
import {
  getAdjustedPlacement,
  getContainerClass,
  getContent,
  getPosition,
} from "./utils";

type PositionGetter = (ogma: OgmaLib) => Point | null;

interface TooltipProps {
  /** Tooltip id */
  id?: string;
  /** Tooltip position */
  position: Point | PositionGetter;
  /** Tooltip content */
  content?: Content;
  /** Tooltip size */
  size?: Size;
  /** Tooltip visibility */
  visible?: boolean;
  /** Tooltip placement relative to the position */
  placement?: Placement;
  /** Tooltip container className */
  tooltipClass?: string;

  children?: ReactNode;
}

const TooltipComponent = (
  {
    tooltipClass = "ogma-tooltip",
    placement = "right",
    position,
    size = { width: "auto", height: "auto" } as any as Size,
    children,
    content,
    visible = true,
  }: TooltipProps,
  ref?: Ref<OverlayLayer>
) => {
  const ogma = useOgma();
  const [layer, setLayer] = useState<OverlayLayer>();
  const [coords, setCoords] = useState<Point | null>();
  const [html, setHtml] = useState("");
  const [dimensions, setDimensions] = useState<Size>();
  const raf = useRef<number>();

  useImperativeHandle(ref, () => layer!, [layer]);

  // component is mounted
  useEffect(() => {
    const className = getContainerClass(tooltipClass, placement);
    const wrapperHtml = `<div class="${className}"><div class="${tooltipClass}--content" /></div>`;
    const newCoords = { x: -9999, y: -9999 };
    setCoords(newCoords);
    const tooltip = ogma.layers.addOverlay({
      position: newCoords,
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
    if (layer) {
      if (newContent !== html) {
        layer.element.firstElementChild!.innerHTML = newContent;
        setHtml(newContent);
        setDimensions({
          width: layer.element.offsetWidth,
          height: layer.element.offsetHeight,
        });
      }
      const newCoords = getPosition(position, ogma);
      if (coords !== newCoords) {
        setCoords(newCoords);
      }
      if (visible) layer.show();
      else layer.hide();
    }
    raf.current = requestAnimationFrame(() => {
      if (layer && layer.element && coords && dimensions) {
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

/**
 * Tooltip layer is a custom component to render some dynamic data on top of
 * your visualisation. The position and contents can be changed quickly and it
 * will adapt the placement to the viewport size. See in in action in our
 * [example](linkurious.github.io/ogma-react/)
 */
export const Tooltip = forwardRef(TooltipComponent);
