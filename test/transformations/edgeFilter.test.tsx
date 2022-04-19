import React, { createRef } from "react";
import { render } from "react-dom";
import OgmaLib from "@linkurious/ogma";
import { Ogma, EdgeFilter } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("Edge filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Edge filter component renders without crashing", (done) => {
    const ref = createRef<OgmaLib>();
    render(
      <Ogma graph={graph} ref={ref}>
        <EdgeFilter criteria={(edge) => edge.getId() === 1} />
      </Ogma>,
      div
    );
    ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toBe(1);
        done();
      })
      .catch(done);
  });
});
