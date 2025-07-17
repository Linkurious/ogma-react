import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  Ref
} from "react";
import { CanvasLayer as OgmaCanvasLayer } from "@linkurious/ogma";
import { useOgma } from "../context";

interface CanvasLayerProps {
  /** Rendering function */
  render: (ctx: CanvasRenderingContext2D) => void;
  /** Whether or not the layer should be moved with the graph */
  isStatic?: boolean;
  /** Avoid redraw */
  noClear?: boolean;
  /** Layer index */
  index?: number;
  /** Layer visibility */
  visible?: boolean;
}

const CanvasLayerComponent = (
  {
    noClear = false,
    isStatic = false,
    render,
    index,
    visible = true
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
      if (index && isFinite(index)) layer.moveTo(index);
      if (visible) layer.show();
      else layer.hide();
    }
  }, [layer, index, visible]);

  return null;
};

/**
 * A canvas layer that can be added to the Ogma instance. See the [Ogma documentation](https://doc.linkurio.us/ogma/latest/api.html#Ogma-layers-addCanvasLayer) for more information.
 *
 * Useful to perform drawings in sync with the view. In the drawing function you
 * are given the CanvasRenderingContext2D, that is automatically scaled and
 * translated to be in sync with the graph. So you can simply use graph
 * coordinates to draw shapes and text in it. See our "Layers" examples for
 * the code snippets.
 */
export const CanvasLayer = forwardRef(CanvasLayerComponent);
