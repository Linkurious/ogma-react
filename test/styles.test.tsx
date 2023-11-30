import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import OgmaLib from "@linkurious/ogma";
import { Ogma, NodeStyleRule, EdgeStyleRule } from "../src";
import graph from "./fixtures/simple_graph.json";

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

  it("Passes node attributes", () => {
    return new Promise((resolve) => {
      const onReady = (ogma: OgmaLib) => {
        ogma.view.afterNextFrame().then(() => {
          expect(ogma.getNodes().getAttribute("color")).toStrictEqual([
            "red",
            "red",
            "red",
          ]);
          resolve(null);
        });
      };
      render(
        <Ogma graph={graph} onReady={onReady}>
          <NodeStyleRule attributes={{ color: "red" }} />
        </Ogma>,
        div
      );
    });
  });

  it("Uses selector for NodeStyle", () => {
    return new Promise((resolve) => {
      const onReady = (ogma: OgmaLib) => {
        ogma.view.afterNextFrame().then(() => {
          expect(ogma.getNodes().getAttribute("color")).toStrictEqual([
            "red",
            "red",
            "green",
          ]);
          resolve(null);
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

  it("Passes edge attributes", () => {
    return new Promise((resolve) => {
      const onReady = (ogma: OgmaLib) => {
        ogma.view.afterNextFrame().then(() => {
          expect(ogma.getEdges().getAttribute("color")).toStrictEqual([
            "red",
            "red",
          ]);
          resolve(null);
        });
      };
      render(
        <Ogma graph={graph} onReady={onReady}>
          <EdgeStyleRule attributes={{ color: "red" }} />
        </Ogma>,
        div
      );
    });
  });

  it("Uses selector for EdgeStyle", () => {
    return new Promise((resolve) => {
      const onReady = (ogma: OgmaLib) => {
        ogma.view.afterNextFrame().then(() => {
          expect(ogma.getEdges().getAttribute("color")).toStrictEqual([
            "grey",
            "green",
          ]);
          resolve(null);
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
