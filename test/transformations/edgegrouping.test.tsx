import React from "react";
import { render } from "react-dom";
// import { act } from "react-dom/test-utils";
// import OgmaLib from "@linkurious/ogma";
import { Ogma, EdgeGrouping } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("styles", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Edge grouping component renders without crashing", () => {
    render(
      <Ogma graph={graph}>
        <EdgeGrouping groupIdFunction={(edge) => edge.getId().toString()} />
      </Ogma>,
      div
    );
  });
});
