import OgmaLib, {
  Edge,
  Node,
  Point,
  RawGraph,
  NodeGrouping as NodeGroupingTransformation,
  EventTypes
} from "@linkurious/ogma";
import { useEffect, useState, createRef, useCallback } from "react";
import { LoadingOverlay } from "./components/LoadingOverlay";
// for geo mode
import * as L from "leaflet";
// components
import {
  Ogma,
  NodeStyleRule,
  EdgeStyleRule,
  Tooltip,
  NodeGrouping,
  Popup,
  Geo,
  NodeGroupingProps
} from "../../src";

// cusotm components:
// layout component, to be applied on certain events
import { LayoutService } from "./components/Layout";
// outlines canvas layer with halos
import { GraphOutlines } from "./components/GraphOutlines";
// control panel
import { Controls } from "./components/Controls";
import { MousePosition } from "./components/MousePosition";
import { Logo } from "./components/Logo";

// to enable geo mode integration
OgmaLib.libraries["leaflet"] = L;

type ND = unknown;
type ED = unknown;

export default function App() {
  // graph state
  const [graph, setGraph] = useState<RawGraph>();
  const [loading, setLoading] = useState(true);

  // UI states
  const [popupOpen, setPopupOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState<Node>();

  // ogma instance and grouping references
  const ogmaInstanceRef = createRef<OgmaLib>();
  const [initialized, setInitialized] = useState(false);
  const groupingRef = createRef<NodeGroupingTransformation<ND, ED>>();

  // grouping and geo states
  const [nodeGrouping, setNodeGrouping] = useState(true);
  const [geoEnabled, setGeoEnabled] = useState(false);
  // styling states
  const [nodeSize, setNodeSize] = useState(5);
  const [edgeWidth, setEdgeWidth] = useState(0.5);
  const [groupingOptions] = useState<NodeGroupingProps<any, any>>({
    groupIdFunction: (node) => {
      const categories = node.getData("categories");
      if (!categories) return undefined;
      return categories[0] === "INVESTOR" ? "INVESTOR" : undefined;
    },
    nodeGenerator: (nodes) => {
      return { data: { multiplier: nodes.size } };
    },
    disabled: true
  });

  // UI layers
  const [outlines, setOutlines] = useState(false);
  const [tooltipPositon, setTooltipPosition] = useState<Point>({
    x: 0,
    y: 0
  });
  const [target, setTarget] = useState<Node | Edge | null>();

  const requestSetTooltipPosition = useCallback((pos: Point) => {
    requestAnimationFrame(() => setTooltipPosition(pos));
  }, []);

  const popupPosition = useCallback(
    () => (clickedNode ? clickedNode.getPosition() : null),
    [clickedNode]
  );
  const onPopupClose = useCallback(() => setPopupOpen(false), []);

  // load the graph
  useEffect(() => {
    setLoading(true);
    fetch("data.json")
      .then((res) => res.json())
      .then((data: RawGraph) => {
        setGraph(data);
        setLoading(false);
      });
  }, []);

  const onClick = useCallback(({ target }: EventTypes<ND, ED>["click"]) => {
    if (target && target.isNode) {
      setClickedNode(target);
      setPopupOpen(true);
    }
  }, []);

  const onMousemove = useCallback(
    ({ }: EventTypes<ND, ED>["mousemove"]) => {
      if (!ogmaInstanceRef.current) return;
      const ptr = ogmaInstanceRef.current.getPointerInformation();
      console.log("onMousemove", ptr);
      // requestSetTooltipPosition(
      //   ogmaInstanceRef.current.view.screenToGraphCoordinates({
      //     x: ptr.x,
      //     y: ptr.y
      //   })
      // );
      // setTarget(ptr.target);
    },
    []
  );

  const onAddNodes = useCallback(() => {
    if (!ogmaInstanceRef.current) return;
    console.log("ON ADD");
    ogmaInstanceRef.current.view.locateGraph({ duration: 250, padding: 50 });
  }, []);

  const onReady = useCallback((instance: OgmaLib<ND, ED>) => {
    ogmaInstanceRef.current = instance;
    console.log("onReady", ogmaInstanceRef.current);
    setInitialized(true);
  }, []);

  useEffect(() => {
    console.log("ogma changed", ogmaInstanceRef);
  }, [initialized]);

  const addNode = useCallback(() => {
    if (!ogmaInstanceRef.current) return;
    ogmaInstanceRef.current.addNode({
      id: ogmaInstanceRef.current.getNodes().size
    });
  }, []);

  // nothing to render yet
  if (loading) return <LoadingOverlay />;

  return (
    <div className="App">
      <Logo />
      <Ogma
        ref={ogmaInstanceRef}
        graph={graph}
        onClick={onClick}
        onMousemove={onMousemove}
        onAddNodes={onAddNodes}
        onReady={onReady}
      >
        {/* Styling */}
        <NodeStyleRule
          attributes={{
            color: "#247BA0",
            radius: (n) => (n?.getData("multiplier") || 1) * nodeSize, // the label is the value os the property name.
            text: {
              content: (node) => node?.getData("properties.name"),
              font: "IBM Plex Sans",
              minVisibleSize: 3
            }
          }}
        />
        <EdgeStyleRule attributes={{ width: edgeWidth }} />

        {/* Layout */}
        <LayoutService />

        {/* Grouping */}
        <NodeGrouping
          ref={groupingRef}
          disabled={!nodeGrouping && !geoEnabled}
          groupIdFunction={groupingOptions.groupIdFunction}
          nodeGenerator={groupingOptions.nodeGenerator}
        />

        {/* context-aware UI */}
        <Popup
          position={popupPosition}
          onClose={onPopupClose}
          isOpen={!!clickedNode && popupOpen}
        >
          {!!clickedNode && (
            <div className="content">{`Node ${clickedNode.getId()}:`}</div>
          )}
        </Popup>
        <Tooltip
          visible={!!target && !popupOpen}
          placement="right"
          position={tooltipPositon}
        >
          <div className="x">
            {target
              ? `${target.isNode ? "Node" : "Edge"} #${target.getId()}`
              : "nothing"}
          </div>
        </Tooltip>
        <GraphOutlines visible={outlines} />

        {/* Geo mode */}
        <Geo
          enabled={geoEnabled}
          longitudePath="properties.longitude"
          latitudePath="properties.latitude"
        />
        <MousePosition />
      </Ogma>
      <Controls
        toggleNodeGrouping={(value) => setNodeGrouping(value)}
        nodeGrouping={nodeGrouping}
        setNodeSize={setNodeSize}
        setEdgeWidth={setEdgeWidth}
        outlines={outlines}
        setOutlines={setOutlines}
        geoEnabled={geoEnabled}
        setGeoEnabled={setGeoEnabled}
        addNode={addNode}
      />
    </div>
  );
}
