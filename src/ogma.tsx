import React, { useState, useEffect, useLayoutEffect, FC } from "react";
import OgmaLib, { Options as OgmaOptions } from "@linkurious/ogma";
import { OgmaContext } from "./context";

interface OgmaProps {
  options: Partial<OgmaOptions>;
  // onEvent?: (
  //   //evt: OgmaEvent<undefined>
  //   ogma: OgmaLib
  // ) => null;
  onReady?: (ogma: OgmaLib) => void;
}

export const Ogma: FC<OgmaProps> = ({
  options,
  children,
  //onStyleLoad,
  //control,
  //scrollZoom,
  onReady,
}) => {
  console.log("Ogma", options, useState);
  const [ready, setReady] = useState(false);
  const [ogma, setOgma] = useState<OgmaLib | undefined>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib({
        container,
        graph: { nodes: [{ attributes: { color: "red" } }], edges: [] },
        ...options,
      });

      // if (control) {
      //   map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
      // }

      //ogma.events.once((evt) => {
      // ... some async stuff
      //});

      setOgma(instance);
      setReady(true);
      if (onReady) onReady(instance);
    }
  }, [setOgma, container]);

  // resize handler
  useLayoutEffect(() => {
    const updateSize = () => ogma?.view.forceResize();
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <OgmaContext.Provider value={ogma}>
      <div
        style={{ width: "100%", height: "100%" }}
        ref={(containerRef) => setContainer(containerRef)}
      >
        {ready && children}
      </div>
    </OgmaContext.Provider>
  );
};
