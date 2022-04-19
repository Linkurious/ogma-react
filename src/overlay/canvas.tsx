import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  Ref,
} from "react";
import { CanvasLayer as OgmaCanvasLayer } from "@linkurious/ogma";
import { useOgma } from "../context";

interface CanvasLayerProps {
  render: (ctx: CanvasRenderingContext2D) => void;
  isStatic?: boolean;
  noClear?: boolean;
  index?: number;
  visible?: boolean;
}

const CanvasLayerComponent = (
  {
    noClear = false,
    isStatic = false,
    render,
    index,
    visible,
  }: CanvasLayerProps,
  ref?: Ref<OgmaCanvasLayer>
) => {
  const ogma = useOgma();
  const [layer, setLayer] = useState<OgmaCanvasLayer | null>(null);

  useImperativeHandle(ref, () => layer as OgmaCanvasLayer, [layer]);

  useEffect(() => {
    const newLayer = ogma.layers.addCanvasLayer(
      render,
      { isStatic, noClear },
      index
    );
    setLayer(newLayer);

    return () => {
      if (newLayer) {
        newLayer.destroy();
        setLayer(null);
      }
    };
  }, []);

  useEffect(() => {
    if (layer) {
      if (index !== undefined && isFinite(index)) layer.moveTo(index);
      if (visible === layer.isHidden()) visible ? layer.show() : layer.hide();
      else layer.hide();
    }
  }, [layer, index, visible]);

  return null;
};

export const CanvasLayer = forwardRef(CanvasLayerComponent);
