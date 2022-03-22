import { RawGraph, NodeList } from "@linkurious/ogma";
import React, { useEffect } from "react";
import {
  Ogma,
  NodeStyleRule,
  EdgeStyleRule,
  useOgma,
  Tooltip,
  NodeGrouping,
} from "../../src";
import { LayoutService } from "./LayoutService";

export default function App() {
  const graph: RawGraph = {
    nodes: [
      { id: 0, attributes: { color: "red", x: 0, y: 0 } },
      { id: 1, attributes: { color: "green", x: 100, y: 0 } },
      { id: 2, attributes: { color: "green", x: 100, y: 0 } },
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
    ],
  };

  return (
    <div className="App">
      <Ogma options={{}} graph={graph}>
        <NodeStyleRule attributes={{ color: "blue" }} />
        <EdgeStyleRule attributes={{ color: "blue" }} />
        <LayoutService />
        <Tooltip
          position={{ x: 100, y: 200 }}
          content={'<div class="x">ttp</div>'}
        />
        <NodeGrouping
          groupIdFunction={(node) => {
            const id = Number(node.getId());
            return id === 1 || id === 2 ? "grouped" : undefined;
          }}
          transformationRef={(grouping) => console.log(grouping)}
        />
      </Ogma>
    </div>
  );
}
