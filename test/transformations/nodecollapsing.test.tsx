import React from "react";
import { render } from "react-dom";
// import { act } from "react-dom/test-utils";
// import OgmaLib from "@linkurious/ogma";
import { Ogma, NodeCollapsing } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("styles", () => {
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
