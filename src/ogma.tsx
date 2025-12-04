import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref,
  memo,
  useMemo
} from "react";
import ReactDOMServer from "react-dom/server";
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
  onReady?: (ogma: OgmaLib) => void;
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
  const memoizedChildren = useMemo(() => children, [children]);
  const [ogma, setOgma] = useState<OgmaLib | undefined>();
  const [graphData, setGraphData] = useState<RawGraph<ND, ED>>();
  const [ogmaOptions, setOgmaOptions] = useState<OgmaOptions>(defaultOptions);
  const [graphTheme, setGraphTheme] = useState<Theme<ND, ED>>();

  useImperativeHandle(ref, () => {
    return ogma as OgmaLib<ND, ED>;
  }, [ogma]);

  useEffect(() => {
    if (!containerRef.current || ogma) return;

    console.log("Creating Ogma instance");
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
      console.log("Updating graph data");
      setGraphData(graph);
      ogma.setGraph(graph);
    }
    if (options && isContentEqual(options, ogmaOptions) === false) {
      console.log("Updating options");
      setOgmaOptions(options);
      ogma.setOptions(options);
    }
  }, [graph, options]);

  useEffect(() => {
    if (!ogma) return;

    if (theme && isContentEqual(theme, graphTheme) === false) {
      console.log("Updating theme");
      setGraphTheme(theme);
      ogma.styles.setTheme(theme);
    }
  }, [theme]);

  // Set up event handlers whenever props change
  useEffect(() => {
    if (!ogma) return;

    console.log("Updating event handlers");
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
          {memoizedChildren}
        </OgmaContext.Provider>
      )}
    </div>
  );
};

export const Ogma = memo(forwardRef(OgmaComponent), (prevProps, nextProps) => {
  return Object.keys(prevProps)
    // Check if any prop has changed, if not, skip re-render
    .some((key) => {
      if (key === 'ref') return false; // skip ref comparison
      try {
        console.log('Comparing prop:', key);
        // Special handling for children prop
        if (key === 'children') {
          const prevChildren = prevProps[key];
          const nextChildren = nextProps[key];
          
          // If both are null/undefined, they're the same
          if (prevChildren == null && nextChildren == null) {
            return false;
          }
          
          // If one is null/undefined and the other isn't, they're different
          if (prevChildren == null || nextChildren == null) {
            return true;
          }
          
          try {
            // Try to compare using static markup rendering
            const prevMarkup = ReactDOMServer.renderToStaticMarkup(prevChildren);
            const nextMarkup = ReactDOMServer.renderToStaticMarkup(nextChildren);
            const isDifferent = prevMarkup !== nextMarkup;
            console.log('Children comparison result:', isDifferent);
            return isDifferent;
          } catch (e) {
            // If rendering fails (e.g., due to hooks or context), fall back to reference comparison
            console.log('Children comparison fallback to reference:', prevChildren !== nextChildren);
            return prevChildren !== nextChildren;
          }
        }
        
        // @ts-expect-error
        const comparison = JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key]);
        console.log('result:', comparison);
        return comparison;
      } catch (e) {
        console.log('error comparing prop:', key, e);
        return true;
      }
    }) === false;
});
