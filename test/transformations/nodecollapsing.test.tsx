import React from "react";
import { render } from "react-dom";
import { Ogma, NodeCollapsing } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("Node collapsing", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Node collapsing component renders without crashing", () => {
    render(
      <Ogma graph={graph}>
        <NodeCollapsing
          selector={(node) => node.getId() === "hidden"}
          edgeGenerator={(_hiddenNode) => ({ data: { type: "mid" } })}
        />
      </Ogma>,
      div
    );
  });
});
