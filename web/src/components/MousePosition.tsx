import { Point, Layer as OgmaLayer } from "@linkurious/ogma";
import { useEffect, useState, useCallback, useRef } from "react";
import { useOgma, Layer } from "../../../src";
import "./MousePosition.css";

export const MousePosition = () => {
  const ogma = useOgma();
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const layerRef = useRef<OgmaLayer>(null);

  const requestSetPosition = useCallback(
    (pos: Point) => {
      requestAnimationFrame(() => setPosition(pos));
    },
    [setPosition]
  );

  useEffect(() => {
    const listener = () => {
      const { x, y } = ogma.getPointerInformation();
      requestSetPosition({ x, y });
    };
    ogma.events.on("mousemove", listener);
    return () => {
      ogma.events.off(listener);
    };
  }, [ogma]);

  return (
    <Layer className="position-control" ref={layerRef}>
      <div className="position-control__container">
        {position.x},&nbsp;{position.y}
      </div>
    </Layer>
  );
};
