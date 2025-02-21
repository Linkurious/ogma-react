import {
  useEffect,
  useState,
  ReactNode,
  Ref,
  forwardRef,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import { Layer as OgmaLayer } from "@linkurious/ogma";
import { useOgma } from "../context";

export interface LayerProps {
  children?: ReactNode;
  /** Overlay container className */
  className?: string;
  /** Layer index */
  index?: number;
}

export const Layer = forwardRef(
  ({ children, className = "", index }: LayerProps, ref?: Ref<OgmaLayer>) => {
    const ogma = useOgma();
    const [layer, setLayer] = useState<OgmaLayer | null>(null);

    useImperativeHandle(ref, () => layer as OgmaLayer, [layer]);

    useEffect(() => {
      const newElt = document.createElement("div");
      newElt.className = className;

      const overlay = ogma.layers.addLayer(newElt, index);
      setLayer(overlay);

      return () => {
        if (layer) {
          layer.destroy();
          setLayer(null);
        }
      };
    }, []);

    useEffect(() => {
      if (layer) layer.element.className = className;
    }, [className]);

    if (!layer) return null;

    return createPortal(children, layer.element);
  },
);
