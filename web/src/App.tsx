import OgmaLib, {
  Edge,
  Node,
  Point,
  RawGraph,
  Transformation,
} from "@linkurious/ogma";
import React, { useEffect, useState, createRef } from "react";
// loading indicator
import { Loading } from "@geist-ui/core";
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
import { Logo } from "./components/Logo";

// to enable geo mode integration
OgmaLib.libraries["leaflet"] = L;

export default function App() {
  // graph state
  const [graph, setGraph] = useState<RawGraph>();
  const [loading, setLoading] = useState(true);

  // UI states
  const [popupOpen, setPopupOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState<Node>();

  // ogma instance and grouping references
  const ref = createRef<OgmaLib>();
  const groupingRef = createRef<Transformation>();

  // grouping and geo states
  const [nodeGrouping, setNodeGrouping] = useState(true);
  const [geoEnabled, setGeoEnabled] = useState(false);
  // styling states
  const [nodeSize, setNodeSize] = useState(5);
  const [edgeWidth, setEdgeWidth] = useState(0.25);
  const [groupingOptions, setGroupingOptions] = useState<NodeGroupingProps<any, any>>({
    groupIdFunction: (node) => {
      const categories = node.getData("categories");
      return categories[0] === "INVESTOR" ? "INVESTOR" : undefined;
    },
    nodeGenerator: (nodes) => {
      return { data: { multiplier: nodes.size } };
    }
  });


  // UI layers
  const [outlines, setOutlines] = useState(false);
  const [tooltipPositon, setTooltipPosition] = useState<Point>({
    x: -1e5,
    y: -1e5,
  });
  const [target, setTarget] = useState<Node | Edge | null>();

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

  function updateGrouping() {
    setGroupingOptions({
      ...groupingOptions,
      groupIdFunction: (node) => {
        const categories = node.getData("categories");
        return categories[0] === "INVESTOR" ? "INVESTOR" : "OTHER";
      }
    })
  }

  // nothing to render yet
  if (loading) return <Loading />;

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
              setTooltipPosition(
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
            text: (node) => node?.getData("properties.name"),
          }}
        />
        <EdgeStyleRule attributes={{ width: edgeWidth }} />

        {/* Layout */}
        <LayoutService />

        {/* context-aware UI */}
        <Popup
          position={() => (clickedNode ? clickedNode.getPosition() : null)}
          onClose={() => setPopupOpen(false)}
          isOpen={clickedNode && popupOpen}
        >
          {clickedNode && (
            <div className="content">{`Node ${clickedNode.getId()}:`}</div>
          )}
        </Popup>
        <Tooltip visible={!!target} placement="top" position={tooltipPositon}>
          <div className="x">
            {target
              ? `${target.isNode ? "Node" : "Edge"} #${target.getId()}`
              : "nothing"}
          </div>
        </Tooltip>
        <GraphOutlines visible={outlines} />

        {/* Grouping */}
        <NodeGrouping
          ref={groupingRef}
          disabled={!nodeGrouping && !geoEnabled}
          groupIdFunction={groupingOptions.groupIdFunction}
          nodeGenerator={groupingOptions.nodeGenerator}
          duration={500}
        />
        {/* Geo mode */}
        <Geo
          enabled={geoEnabled}
          longitudePath="properties.longitude"
          latitudePath="properties.latitude"
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
      <button id="button" onClick={updateGrouping}>update grouping</button>

    </div>
  );
}
