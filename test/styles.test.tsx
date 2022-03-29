import React from "react";
import ReactDOM from "react-dom";
import OgmaLib, { RawGraph } from "@linkurious/ogma";
import { Ogma, NodeStyleRule } from "../src";

const graph: RawGraph = {
  nodes: [
    { id: 0, attributes: { color: "blue", x: 0, y: 0 } },
    { id: 1, attributes: { color: "cyan", x: 25, y: 0 } },
    { id: 2, attributes: { color: "green", x: 25, y: 0 } },
  ],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
};

describe("styles", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Node style component renders without crashing", () => {
    ReactDOM.render(
      <Ogma graph={graph}>
        <NodeStyleRule attributes={{ color: "red" }} />
      </Ogma>,
      div
    );
  });

  it("Passes node attributes", (done) => {
    const onReady = (ogma: OgmaLib) => {
      ogma.view.afterNextFrame().then(() => {
        expect(ogma.getNodes().getAttribute("color")).toStrictEqual([
          "red",
          "red",
          "red",
        ]);
        done();
      });
    };
    ReactDOM.render(
      <Ogma graph={graph} onReady={onReady}>
        <NodeStyleRule attributes={{ color: "red" }} />
      </Ogma>,
      div
    );
  });

  it("Uses selector for NodeStyle", (done) => {
    const onReady = (ogma: OgmaLib) => {
      ogma.view.afterNextFrame().then(() => {
        expect(ogma.getNodes().getAttribute("color")).toStrictEqual([
          "red",
          "red",
          "green",
        ]);
        done();
      });
    };
    ReactDOM.render(
      <Ogma graph={graph} onReady={onReady}>
        <NodeStyleRule
          attributes={{ color: "red" }}
          selector={(node) => Number(node.getId()) < 2}
        />
      </Ogma>,
      div
    );
  });
});
