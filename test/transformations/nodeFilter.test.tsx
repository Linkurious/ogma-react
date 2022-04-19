import React, { createRef } from "react";
import { render } from "react-dom";
import OgmaLib from "@linkurious/ogma";
import { Ogma, NodeFilter } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("Node filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Node filter component renders without crashing", (done) => {
    const ref = createRef<OgmaLib>();
    render(
      <Ogma graph={graph} ref={ref}>
        <NodeFilter criteria={(node) => node.getId() > 0} />
      </Ogma>,
      div
    );

    ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getNodes().size).toBe(2);
        done();
      })
      .catch(done);
  });
});
