import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import OgmaLib, { RawGraph } from "@linkurious/ogma";
import { Ogma, NodeStyleRule, EdgeStyleRule } from "../src";

const graph: RawGraph = {
  nodes: [
    { id: 0, attributes: { color: "blue", x: 0, y: 0 } },
    { id: 1, attributes: { color: "cyan", x: 25, y: 0 } },
    { id: 2, attributes: { color: "green", x: 25, y: 0 } },
  ],
  edges: [
    { id: 0, source: 0, target: 1 },
    { id: 1, source: 0, target: 2 },
  ],
};

describe("styles", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Node style component renders without crashing", () => {
    render(
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
    render(
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
    render(
      <Ogma graph={graph} onReady={onReady}>
        <NodeStyleRule
          attributes={{ color: "red" }}
          selector={(node) => Number(node.getId()) < 2}
        />
      </Ogma>,
      div
    );
  });

  it("NodeStyle cleans up after being removed", () => {
    const Test = ({ onReady }: { onReady: (ogma: OgmaLib) => void }) => {
      const [style, setStyle] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} onReady={onReady}>
          <button onClick={() => setStyle(!style)}>Click</button>
          {style && <NodeStyleRule attributes={{ color: "red" }} />}
        </Ogma>
      );
    };
    let ogmaRef: OgmaLib;
    act(() => {
      render(<Test onReady={(ogma) => (ogmaRef = ogma)} />, div);
    });
    const button = div.querySelector("button") as HTMLButtonElement;
    act(() => button.click());
    expect(ogmaRef!.styles.getNodeRules().length).toBe(0);
  });

  it("Edge style component renders without crashing", () => {
    render(
      <Ogma graph={graph}>
        <EdgeStyleRule attributes={{ color: "red" }} />
      </Ogma>,
      div
    );
  });

  it("Passes edge attributes", (done) => {
    const onReady = (ogma: OgmaLib) => {
      ogma.view.afterNextFrame().then(() => {
        expect(ogma.getEdges().getAttribute("color")).toStrictEqual([
          "red",
          "red",
        ]);
        done();
      });
    };
    render(
      <Ogma graph={graph} onReady={onReady}>
        <EdgeStyleRule attributes={{ color: "red" }} />
      </Ogma>,
      div
    );
  });

  it("Uses selector for EdgeStyle", (done) => {
    const onReady = (ogma: OgmaLib) => {
      ogma.view.afterNextFrame().then(() => {
        expect(ogma.getEdges().getAttribute("color")).toStrictEqual([
          "grey",
          "green",
        ]);
        done();
      });
    };
    render(
      <Ogma graph={graph} onReady={onReady}>
        <EdgeStyleRule
          attributes={{ color: "green" }}
          selector={(edge) => Number(edge.getId()) > 0}
        />
      </Ogma>,
      div
    );
  });

  it("EdgeStyle cleans up after being removed", () => {
    const Test = ({ onReady }: { onReady: (ogma: OgmaLib) => void }) => {
      const [style, setStyle] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} onReady={onReady}>
          <button onClick={() => setStyle(!style)}>Click</button>
          {style && <EdgeStyleRule attributes={{ color: "red" }} />}
        </Ogma>
      );
    };
    let ogmaRef: OgmaLib;
    act(() => {
      render(<Test onReady={(ogma) => (ogmaRef = ogma)} />, div);
    });
    const button = div.querySelector("button") as HTMLButtonElement;
    act(() => button.click());
    expect(ogmaRef!.styles.getEdgeRules().length).toBe(0);
  });
});
