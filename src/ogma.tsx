import {
  useState,
  useEffect,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
  useCallback
} from "react";
import OgmaLib, { Options as OgmaOptions, RawGraph } from "@linkurious/ogma";
import { OgmaContext } from "./context";

interface OgmaProps<ND, ED> {
  options?: Partial<OgmaOptions>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: RawGraph<ND, ED>;
  children?: ReactNode;
  style?: React.CSSProperties;
}

const defaultOptions = {};

type InstanceRef<ND, ED> = OgmaLib<ND, ED> | null;

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = <ND, ED>(
  {
    options = defaultOptions,
    children,
    graph,
    onReady,
    style = { width: "100%", height: "100%" }
  }: OgmaProps<ND, ED>,
  ref?: Ref<OgmaLib<ND, ED>>
) => {
  const [ready, setReady] = useState(false);
  const [ogma, setOgma] = useState<OgmaLib | undefined>();
  const [graphData, setGraphData] = useState<RawGraph<ND, ED>>();
  const [ogmaOptions, setOgmaOptions] = useState<OgmaOptions>(defaultOptions);

  const containerRef = useCallback((container: HTMLDivElement | null) => {
    if (container !== null && !ogma) {
      const instance = new OgmaLib<ND, ED>({
        container,
        graph,
        options
      });
      setOgma(instance);
      setReady(true);
      if (onReady) onReady(instance);
    }
  }, []);

  useImperativeHandle<InstanceRef<ND, ED>, InstanceRef<ND, ED>>(
    ref,
    () => ogma ?? null,
    [ogma]
  );

  // resize handler
  useLayoutEffect(() => {
    const updateSize = () => ogma?.view.forceResize();
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (ogma) {
      if (graph && ogma && graph !== graphData) {
        setGraphData(graph);
        ogma.setGraph(graph);
      }
      if (options && ogmaOptions !== options) {
        setOgmaOptions(options);
        ogma.setOptions(options);
      }
    }
  }, [graph, options]);

  // Prepare the instance first before initializing the context
  const contents = ogma ? (
    <OgmaContext.Provider value={ogma}>
      {ready && children}
    </OgmaContext.Provider>
  ) : null;

  return (
    <div style={style} ref={containerRef}>
      {contents}
    </div>
  );
};

export const Ogma = forwardRef(OgmaComponent);
