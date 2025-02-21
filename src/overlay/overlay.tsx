import {
  useEffect,
  useState,
  ReactNode,
  Ref,
  forwardRef,
  useImperativeHandle
} from "react";

import OgmaLib, {
  Overlay as OverlayLayer,
  Size,
  Point
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { getPosition } from "./utils";
import { createPortal } from "react-dom";

interface OverlayProps {
  /** Overlay position */
  position: Point | ((ogma: OgmaLib) => Point | null);
  /** Overlay size */
  size?: Size;
  children?: ReactNode;
  /** Overlay container className */
  className?: string;
  /** Whether the overlay should be scaled with the graph */
  scaled?: boolean;
}

const offScreenPos: Point = { x: -9999, y: -9999 };

// TODO: use props for these classes
export const Overlay = forwardRef(
  (
    { position, children, className = "", size, scaled }: OverlayProps,
    ref?: Ref<OverlayLayer>
  ) => {
    const ogma = useOgma();
    const [layer, setLayer] = useState<OverlayLayer | null>(null);

    useImperativeHandle(ref, () => layer as OverlayLayer, [layer]);

    useEffect(() => {
      // register listener
      const pos = getPosition(position, ogma) || offScreenPos;
      const newElement = document.createElement("div");
      newElement.className = className;
      //  html = getContent(ogma, pos, undefined, children);

      const overlay = ogma.layers.addOverlay({
        position: pos || offScreenPos,
        element: newElement,
        size: size || ({ width: "auto", height: "auto" } as any as Size),
        scaled
      });

      setLayer(overlay);

      return () => {
        // unregister listener
        if (layer) {
          layer.destroy();
          setLayer(null);
        }
      };
    }, []);

    useEffect(() => {
      if (layer) {
        const pos = getPosition(position, ogma) || offScreenPos;
        if (className) layer.element.className = className;
        layer.setPosition(pos);
      }
    }, [position, className]);

    if (!layer) return null;

    return createPortal(children, layer.element);
  }
);
