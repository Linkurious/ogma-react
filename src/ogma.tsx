import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
  Ref
} from "react";
import OgmaLib, {
  Options as OgmaOptions,
  RawGraph,
  EventTypes
} from "@linkurious/ogma";
import { OgmaContext } from "./context";
import {
  EventHandlerProps,
  getEventNameFromProp,
  EventHandlers,
  forEachEventHandler
} from "./types";

interface OgmaProps<ND, ED> extends EventHandlerProps<EventTypes<ND, ED>> {
  options?: Partial<OgmaOptions>;
  onReady?: (ogma: OgmaLib) => void;
  graph?: RawGraph<ND, ED>;
  children?: ReactNode;
}

const defaultOptions = {};

/**
 * Main component for the Ogma library.
 */
export const OgmaComponent = <ND, ED>(
  props: OgmaProps<ND, ED>,
  ref?: Ref<OgmaLib<ND, ED>>
) => {
  const { options = defaultOptions, children, graph, onReady } = props;
  const eventHandlersRef = useRef<EventHandlers<ND, ED>>({});
  const [ready, setReady] = useState(false);
  const [ogma, setOgma] = useState<OgmaLib | undefined>();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [graphData, setGraphData] = useState<RawGraph<ND, ED>>();
  const [ogmaOptions, setOgmaOptions] = useState<OgmaOptions>(defaultOptions);
  const instanceRef = useRef<OgmaLib<ND, ED>>(null);

  useImperativeHandle(ref, () => {
    return ogma as OgmaLib<ND, ED>;
  }, [ogma]);

  useEffect(() => {
    if (container) {
      const instance = new OgmaLib<ND, ED>({
        container,
        graph,
        options
      });

      //console.info("new instance");
      instanceRef.current = instance;
      setOgma(instance);
      setReady(true);

      // send the new instance to the parent component
      if (onReady) onReady(instance);
    }
  }, [container]);

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

  // Set up event handlers whenever props change
  useEffect(() => {
    if (!ogma) return;

    // Get all current event handler props
    const currentEventHandlers: EventHandlers<ND, ED> = {};

    // Check all props for event handlers (onXxx)
    Object.keys(props).forEach((propName) => {
      if (!propName.startsWith("on")) return;
      const name = propName as keyof EventTypes<ND, ED>;
      const eventName = getEventNameFromProp<ND, ED>(name);
      const propValue = props[propName as keyof OgmaProps<ND, ED>];

      if (eventName && typeof propValue === "function") {
        // No type assertion needed, eventName is already verified
        currentEventHandlers[eventName] = propValue as (
          event: EventTypes<ND, ED>[NonNullable<typeof eventName>]
        ) => void;
      }
    });

    // Remove handlers that are no longer present
    forEachEventHandler(eventHandlersRef.current, (eventName, handler) => {
      if (!currentEventHandlers[eventName]) {
        // Handler was removed
        ogma.events.off(handler);
        delete eventHandlersRef.current[eventName];
      }
    });

    //console.log(2, currentEventHandlers, eventHandlersRef.current);

    // Add new handlers
    forEachEventHandler(currentEventHandlers, (eventName, handler) => {
      const existingHandler = eventHandlersRef.current[eventName];
      //console.log("check", eventName, existingHandler === handler);

      // If handler changed, remove old one
      if (existingHandler && existingHandler !== handler) {
        ogma.events.off(existingHandler);
      }

      // If it's a new handler or changed handler, add it
      if (!existingHandler || existingHandler !== handler) {
        //console.log(555, "add handler", eventName, existingHandler === handler);
        ogma.events.on(eventName, handler);
        // @ts-expect-error type union
        eventHandlersRef.current[eventName] = handler;
      }
    });
  }, [props]);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={(containerRef) => setContainer(containerRef)}
    >
      {ogma && (
        <OgmaContext.Provider value={ogma}>
          {ready && children}
        </OgmaContext.Provider>
      )}
    </div>
  );
};

export const Ogma = forwardRef(OgmaComponent);
