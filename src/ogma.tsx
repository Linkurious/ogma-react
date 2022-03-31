import React, {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
} from "react";
import OgmaLib, { Options as OgmaOptions, RawGraph } from "@linkurious/ogma";
import { OgmaContext } from "./context";

interface OgmaProps<ND, ED> {
  options?: Partial<OgmaOptions>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: RawGraph<ND, ED>;
  children?: ReactNode;
}

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = <ND, ED>(
  { options = {}, children, graph, onReady }: OgmaProps<ND, ED>,
  ref?: Ref<OgmaLib<ND, ED>>
) => {
  const [ready, setReady] = useState(false);
  const [ogma, setOgma] = useState<OgmaLib | undefined>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ogma as OgmaLib<ND, ED>, [ogma]);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib<ND, ED>({
        container,
        graph,
        options,
      });

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

export const Ogma = forwardRef(OgmaComponent);
