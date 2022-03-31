import { Node, RawGraph } from "@linkurious/ogma";
import React, { useEffect, useState } from "react";
import {
  Ogma,
  NodeStyleRule,
  EdgeStyleRule,
  Tooltip,
  NodeGrouping,
  Popup,
} from "../../src";
import { LayoutService } from "./LayoutService";

export default function App() {
  const graph: RawGraph = {
    nodes: [
      { id: 0, attributes: { color: "red", x: 0, y: 0 } },
      { id: 1, attributes: { color: "green", x: 25, y: 0 } },
      { id: 2, attributes: { color: "green", x: 25, y: 0 } },
    ],
    edges: [
      { source: 0, target: 1 },
      { source: 0, target: 2 },
    ],
  };

  const [popupOpen, setPopupOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState<Node>(null);

  return (
    <div className="App">
      <Ogma
        options={{}}
        graph={graph}
        onReady={(ogma) => {
          ogma.events.on("click", ({ target }) => {
            if (target && target.isNode) {
              setClickedNode(target);
              setPopupOpen(true);
            }
          });
        }}
      >
        <NodeStyleRule attributes={{ color: "#247BA0", radius: 2 }} />
        <EdgeStyleRule attributes={{ color: "#247BA0", width: 0.15 }} />
        {/* <LayoutService /> */}
        {/* <Tooltip
          position={(ogma) => ogma.getNodes().get(0).getPosition()}
          content={'<div class="x">ttp</div>'}
        /> */}
        <Popup
          // content="String content"
          position={() => (clickedNode ? clickedNode.getPosition() : null)}
          onClose={() => setPopupOpen(false)}
          placement="left"
          isOpen={popupOpen}
        >
          {clickedNode && (
            <div className="content">{`Node ${clickedNode.getId()}:`}</div>
          )}
        </Popup>
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
