import OgmaLib, {
  Node as OgmaNode,
  RawGraph,
  NodeGrouping as NodeGroupingTransformation,
  NodeAttributesValue,
  Theme
} from "@linkurious/ogma";
import { morningBreeze } from "@linkurious/ogma-styles";
import { useEffect, useState, createRef, useCallback, useMemo } from "react";
import { LoadingOverlay } from "./components/LoadingOverlay";
// for geo mode
import * as L from "leaflet";
// components
import {
  Ogma,
  NodeStyle,
  EdgeStyle,
  StyleClass,
  NodeGrouping,
  Geo,
  NodeGroupingProps,
  useEvent,
  Tooltip
} from "../../src";

// custom components:
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

  // ogma instance and grouping references
  const ogmaInstanceRef = createRef<OgmaLib>();
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
  const [useClass, setUseClass] = useState(false);

  // UI layers
  const [outlines, setOutlines] = useState(false);

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

  const onAddNodes = useEvent("addNodes", () => {
    if (!ogmaInstanceRef.current) return;
    ogmaInstanceRef.current.view.locateGraph({ duration: 250, padding: 50 });
  });

  const onReady = useCallback((instance: OgmaLib<ND, ED>) => {
    ogmaInstanceRef.current = instance;
    window.ogma = instance;
  }, []);

  const addNode = useCallback(() => {
    if (!ogmaInstanceRef.current) return;
    const size = ogmaInstanceRef.current.getNodes().size;
    const node = ogmaInstanceRef.current.addNode({
      id: size
    });
    if (size % 2) node.addClass("class");
  }, []);

  const styleClassNodeAttributes = useMemo<NodeAttributesValue<ND, ED>>(() => {
    return {
      shape: "diamond",
      color: (node) => {
        const categories: string[] = node.getData("categories");
        if (!categories) return "#000000";
        return categories.includes("INVESTOR") ? "#FF0000" : "#00FF00";
      },
      halo: {
        width: 0
      }
    };
  }, []); // memoize the style class props

  // nothing to render yet
  if (loading) return <LoadingOverlay />;

  return (
    <div className="App">
      <Logo />
      <Ogma
        ref={ogmaInstanceRef}
        graph={graph}
        onAddNodes={onAddNodes}
        onReady={onReady}
        theme={morningBreeze as Theme<ND, ED>}
      >
        {/* Styling */}

        <NodeStyle
          attributes={{
            radius: (n) => (n?.getData("multiplier") || 1) * nodeSize, // the label is the value os the property name.
            text: {
              content: (node: OgmaNode) => node?.getData("properties.name"),
              font: "IBM Plex Sans",
              minVisibleSize: 3
            }
          }}
        />

        <NodeStyle.Hovered
          attributes={{
            radius: (n) => (n?.getData("multiplier") || 1) * nodeSize * 1.5,
            color: "#FF0000",
            halo: {
              width: 2,
              color: "#FF0000"
            }
          }}
          fullOverwrite={false}
        />

        <EdgeStyle attributes={{ width: edgeWidth }} />
        {useClass && (
          <StyleClass name="class" nodeAttributes={styleClassNodeAttributes} />
        )}

        <EdgeStyle.Hovered
          attributes={{
            width: (e) => e.getData("weight") * edgeWidth,
            color: "#FF0000"
          }}
          fullOverwrite={false}
        />

        {/* Layout */}
        <LayoutService />

        {/* Grouping */}
        <NodeGrouping
          ref={groupingRef}
          disabled={!nodeGrouping && !geoEnabled}
          groupIdFunction={groupingOptions.groupIdFunction}
          nodeGenerator={groupingOptions.nodeGenerator}
        />

        <Tooltip
          eventName="nodeRightclick"
          bodyClass="ogma-tooltip"
        >
          {(target) => {
            return (
              <div>
                {target.getId()}
              </div>
            )
          }} 
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
        useClass={useClass}
        setUseClass={setUseClass}
      />
    </div>
  );
}
