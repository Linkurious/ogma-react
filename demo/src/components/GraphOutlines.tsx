import { CanvasLayer as OgmaCanvasLayer } from "@linkurious/ogma";
import { useEffect, createRef, useCallback } from "react";
import { useOgma, CanvasLayer } from "../../../src";

interface GraphOutlinesProps {
  visible: boolean;
}

export function GraphOutlines({ visible = true }: GraphOutlinesProps) {
  const ogma = useOgma();
  const layerRef = createRef<OgmaCanvasLayer>();

  const render = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgba(157, 197, 187, 0.25)";
    ctx.beginPath();
    ogma
      .getNodes()
      .getAttributes(["x", "y", "radius"])
      .forEach(({ x, y, radius }) => {
        ctx.moveTo(x, y);
        ctx.arc(x, y, (radius as number) * 6, 0, 2 * Math.PI);
      });
    ctx.fill();
  }, []);

  useEffect(() => {
    const refresh = () => {
      layerRef.current?.refresh();
    };
    ogma.events.on(["nodesDragProgress", "idle"], refresh);
    return () => {
      ogma.events.off(refresh);
    };
  }, []);

  return (
    <CanvasLayer visible={visible} render={render} ref={layerRef} index={0} />
  );
}
