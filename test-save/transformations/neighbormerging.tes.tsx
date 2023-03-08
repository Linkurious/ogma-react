import React from "react";
import { render } from "react-dom";
import { Ogma, NeighborMerging } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("Neighbor merging", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Neighbor merging component renders without crashing", () => {
    render(
      <Ogma graph={graph}>
        <NeighborMerging
          selector={(node) => node.getData("type") === "country"}
          dataFunction={(node) => ({ country: node.getData("name") })}
        />
      </Ogma>,
      div
    );
  });
});
