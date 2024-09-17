import React, { act, createRef } from "react";
import { Root, createRoot } from "react-dom/client";
import { userEvent, waitFor } from "./utils";
import OgmaLib from "@linkurious/ogma";
import { Ogma, NodeStyleRule, EdgeStyleRule } from "../src";
import graph from "./fixtures/simple_graph.json";

describe("styles", () => {
  let div: Root;
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement("div");
    div = createRoot(element);
  });

  it("Node style component renders without crashing", () => {
    act(() =>
      div.render(
        <Ogma graph={graph}>
          <NodeStyleRule attributes={{ color: "red" }} />
        </Ogma>
      )
    );
  });

  it("Passes node attributes", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <NodeStyleRule attributes={{ color: "red" }} />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ref.current!;
    await ogma.view.afterNextFrame();
    expect(ogma.getNodes().getAttribute("color")).toStrictEqual([
      "red",
      "red",
      "red",
    ]);
  });

  it("Uses selector for NodeStyle", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <NodeStyleRule
            attributes={{ color: "red" }}
            selector={(node) => Number(node.getId()) < 2}
          />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ref.current!;
    await ogma.view.afterNextFrame();
    expect(ogma.getNodes().getAttribute("color")).toStrictEqual([
      "red",
      "red",
      "green",
    ]);
  });

  it("NodeStyle cleans up after being removed", async () => {
    const ref = createRef<OgmaLib>();
    const Test = () => {
      const [style, setStyle] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} ref={ref}>
          <button onClick={() => setStyle(!style)}>Click</button>
          {style && <NodeStyleRule attributes={{ color: "red" }} />}
        </Ogma>
      );
    };
    act(() => div.render(<Test />));
    await waitFor(() => expect(ref.current).toBeTruthy());
    const button = element.querySelector("button") as HTMLButtonElement;
    await act(() => userEvent.click(button));
    expect(ref.current!.styles.getNodeRules().length).toBe(0);
  });

  it("Edge style component renders without crashing", () => {
    act(() =>
      div.render(
        <Ogma graph={graph}>
          <EdgeStyleRule attributes={{ color: "red" }} />
        </Ogma>
      )
    );
  });

  it("Passes edge attributes", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <EdgeStyleRule attributes={{ color: "red" }} />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    await ref.current!.view.afterNextFrame();

    expect(ref.current!.getEdges().getAttribute("color")).toStrictEqual([
      "red",
      "red",
    ]);
  });

  it("Uses selector for EdgeStyle", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <EdgeStyleRule
            attributes={{ color: "green" }}
            selector={(edge) => Number(edge.getId()) > 0}
          />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    await ref.current!.view.afterNextFrame();
    expect(ref.current!.getEdges().getAttribute("color")).toStrictEqual([
      "grey",
      "green",
    ]);
  });

  it("EdgeStyle cleans up after being removed", async () => {
    const ref = createRef<OgmaLib>();
    const Test = () => {
      const [style, setStyle] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} ref={ref}>
          <button onClick={() => setStyle(!style)}>Click</button>
          {style && <EdgeStyleRule attributes={{ color: "red" }} />}
        </Ogma>
      );
    };
    act(() => div.render(<Test />));
    await waitFor(() => expect(ref.current).toBeTruthy());
    const button = element.querySelector("button") as HTMLButtonElement;
    await act(() => userEvent.click(button));
    expect(ref.current!.styles.getEdgeRules().length).toBe(0);
  });
});
