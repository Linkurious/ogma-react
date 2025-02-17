import OgmaLib, {
  Edge,
  Node,
  Point,
  RawGraph,
  NodeGrouping as NodeGroupingTransformation,
} from "@linkurious/ogma";
import { useEffect, useState, createRef, useCallback } from "react";
// loading indicator
import { LoadingOverlay } from "@mantine/core";
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
  NodeGroupingProps,
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
import { UpdateGroupingButton } from "./components/UpdateGroupingButton";
import "@mantine/core/styles.css";

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
  const ref = createRef<OgmaLib>();
  const groupingRef = createRef<NodeGroupingTransformation<ND, ED>>();

  // grouping and geo states
  const [nodeGrouping, setNodeGrouping] = useState(true);
  const [geoEnabled, setGeoEnabled] = useState(false);
  // styling states
  const [nodeSize, setNodeSize] = useState(5);
  const [edgeWidth, setEdgeWidth] = useState(0.5);
  const [groupingOptions, setGroupingOptions] = useState<
    NodeGroupingProps<any, any>
  >({
    groupIdFunction: (node) => {
      const categories = node.getData("categories");
      if (!categories) return undefined;
      return categories[0] === "INVESTOR" ? "INVESTOR" : undefined;
    },
    nodeGenerator: (nodes) => {
      return { data: { multiplier: nodes.size } };
    },
    disabled: true,
  });

  // UI layers
  const [outlines, setOutlines] = useState(false);
  const [tooltipPositon, setTooltipPosition] = useState<Point>({
    x: 0,
    y: 0,
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

  // nothing to render yet
  if (loading) return <LoadingOverlay zIndex={400} />;

  return (
    <div className="App">
      <Logo />
      <Ogma
        ref={ref}
        graph={graph}
        onReady={(ogma) => {
          ogma.events
            .on("click", ({ target }) => {
              if (target && target.isNode) {
                setClickedNode(target);
                setPopupOpen(true);
              }
            })
            .on("mousemove", () => {
              const ptr = ogma.getPointerInformation();
              requestSetTooltipPosition(
                ogma.view.screenToGraphCoordinates({ x: ptr.x, y: ptr.y })
              );
              setTarget(ptr.target);
            })
            // locate graph when the nodes are added
            .on("addNodes", () =>
              ogma.view.locateGraph({ duration: 250, padding: 50 })
            );
        }}
      >
        {/* Styling */}
        <NodeStyleRule
          attributes={{
            color: "#247BA0",
            radius: (n) => (n?.getData("multiplier") || 1) * nodeSize, // the label is the value os the property name.
            text: {
              content: (node) => node?.getData("properties.name"),
              font: "IBM Plex Sans",
            },
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
          duration={500}
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
        <UpdateGroupingButton
          options={groupingOptions}
          update={(options) => setGroupingOptions(options)}
        />
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
      />
    </div>
  );
}
