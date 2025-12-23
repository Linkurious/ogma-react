import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
  memo
} from "react";
import OgmaLib, {
  Options as OgmaOptions,
  RawGraph,
  EventTypes
} from "@linkurious/ogma";
import { Theme } from "@linkurious/ogma";
import { OgmaContext } from "./context";
import {
  EventHandlerProps,
  EventHandlers
} from "./types";
import { isContentEqual, handleEventProps } from "./utils";

export interface OgmaProps<ND, ED> extends EventHandlerProps<EventTypes<ND, ED>> {
  options?: Partial<OgmaOptions>;
  onReady?: (ogma: OgmaLib<ND, ED>) => void;
  graph?: RawGraph<ND, ED>;
  children?: ReactNode;
  theme?: Theme<ND, ED>;
  className?: string;
}

const defaultOptions = {};

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = <ND, ED>(
  props: OgmaProps<ND, ED>,
  ref?: Ref<OgmaLib<ND, ED>>
) => {
  const {
    options = defaultOptions,
    children,
    graph,
    onReady,
    theme,
    className = "ogma-container"
  } = props;
  const eventHandlersRef = useRef<EventHandlers<ND, ED>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ogma, setOgma] = useState<OgmaLib<ND, ED> | undefined>();
  const [graphData, setGraphData] = useState<RawGraph<ND, ED>>();
  const [ogmaOptions, setOgmaOptions] = useState<OgmaOptions>(defaultOptions);
  const [graphTheme, setGraphTheme] = useState<Theme<ND, ED>>();

  useImperativeHandle(ref, () => {
    return ogma as OgmaLib<ND, ED>;
  }, [ogma]);

  useEffect(() => {
    if (!containerRef.current || ogma) return;

    const instance = new OgmaLib<ND, ED>({
      container: containerRef.current,
      graph,
      options
    });
    setGraphData(graph);
    setOgmaOptions(options);
    if (theme) {
      setGraphTheme(theme);
      instance.styles.setTheme(theme);
    }

    handleEventProps(instance, props, eventHandlersRef.current);
    setOgma(instance);

    // send the new instance to the parent component
    if (onReady) onReady(instance);
  }, [containerRef.current]);

  // resize handler
  useLayoutEffect(() => {
    const updateSize = () => ogma?.view.forceResize();
    updateSize();

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!ogma) return;

    if (graph && isContentEqual(graph, graphData) === false) {
      setGraphData(graph);
      ogma.setGraph(graph);
    }
    if (options && isContentEqual(options, ogmaOptions) === false) {
      setOgmaOptions(options);
      ogma.setOptions(options);
    }
  }, [graph, options]);

  useEffect(() => {
    if (!ogma) return;

    if (theme && isContentEqual(theme, graphTheme) === false) {
      setGraphTheme(theme);
      ogma.styles.setTheme(theme);
    }
  }, [theme]);

  // Set up event handlers whenever props change
  useEffect(() => {
    if (!ogma) return;

    handleEventProps(ogma, props, eventHandlersRef.current);
  }, [props]);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className={className}
      ref={containerRef}
    >
      {ogma && (
        <OgmaContext.Provider
          value={{
            ogma: ogma
          }}
        >
          {children}
        </OgmaContext.Provider>
      )}
    </div>
  );
};

type OgmaComponentType = <ND, ED>(
  props: OgmaProps<ND, ED> & { ref?: Ref<OgmaLib<ND, ED>> }
) => React.ReactElement | null;

export const Ogma = memo(forwardRef(OgmaComponent)) as OgmaComponentType;
