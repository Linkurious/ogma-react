import React from "react";
import { render } from "react-dom";
// import { act } from "react-dom/test-utils";
// import OgmaLib from "@linkurious/ogma";
import { Ogma, NeighborGeneration } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("styles", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Neighbor generation component renders without crashing", () => {
    render(
      <Ogma graph={graph}>
        <NeighborGeneration
          selector={(node) => node.getId() === "hidden"}
          neighborIdFunction={(node) => node.getData("country")}
          nodeGenerator={(country, _nodes) => ({ data: { type: country } })}
        />
      </Ogma>,
      div
    );
  });
});
