import OgmaLib, {
  Edge,
  Node,
  Point,
  RawGraph,
  Transformation,
} from "@linkurious/ogma";
import React, { useEffect, useState, createRef } from "react";
import {
  Ogma,
  NodeStyleRule,
  EdgeStyleRule,
  Tooltip,
  NodeGrouping,
  Popup,
} from "../../src";
import { Loading } from "@geist-ui/core";
import { LayoutService } from "./components/Layout";
import { Controls } from "./components/Controls";
import { GraphOutlines } from "./components/GraphOutlines";
import { Logo } from "./components/Logo";

export default function App() {
  const [graph, setGraph] = useState<RawGraph>();
  const [loading, setLoading] = useState(true);

  const [popupOpen, setPopupOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState<Node>();

  const ref = createRef<OgmaLib>();
  const groupingRef = createRef<Transformation>();

  const [nodeGrouping, setNodeGrouping] = useState(true);
  const [nodeSize, setNodeSize] = useState(5);
  const [edgeWidth, setEdgeWidth] = useState(0.25);

  // layers
  const [outlines, setOutlines] = useState(false);
  const [tooltipPositon, setTooltipPosition] = useState<Point>({
    x: -1e5,
    y: -1e5,
  });
  const [target, setTarget] = useState<Node | Edge | null>();

  useEffect(() => {
    setLoading(true);
    fetch("data.json")
      .then((res) => res.json())
      .then((data: RawGraph) => {
        setGraph(data);
        setLoading(false);
      });
  }, []);

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
        <NodeStyleRule
          attributes={{
            color: "#247BA0",
            radius: (n) => (n?.getData("multiplier") || 1) * nodeSize, // the label is the value os the property name.
            text: (node) => node?.getData("properties.name"),
          }}
        />
        <EdgeStyleRule attributes={{ width: edgeWidth }} />
        <LayoutService />
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
        <NodeGrouping
          ref={groupingRef}
          disabled={!nodeGrouping}
          groupIdFunction={(node) => {
            const categories = node.getData("categories");
            return categories[0] === "INVESTOR" ? "INVESTOR" : undefined;
          }}
          nodeGenerator={(nodes) => {
            return { data: { multiplier: nodes.size } };
          }}
          duration={500}
        />
        <GraphOutlines visible={outlines} />
      </Ogma>
      <Controls
        toggleNodeGrouping={(value) => setNodeGrouping(value)}
        nodeGrouping={nodeGrouping}
        setNodeSize={setNodeSize}
        setEdgeWidth={setEdgeWidth}
        outlines={outlines}
        setOutlines={setOutlines}
      />
    </div>
  );
}
