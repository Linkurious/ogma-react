import React, { act, createRef } from "react";
import { Root, createRoot } from "react-dom/client";
import { userEvent, waitFor } from "../utils";
import OgmaLib, { Edge } from "@linkurious/ogma";
import { Ogma, NodeStyle, EdgeStyle } from "../../../src";
import graph from "../fixtures/simple_graph.json";

describe("styles", async () => {
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
          <NodeStyle attributes={{ color: "red" }} />
        </Ogma>
      )
    );
  });

  it("Passes node attributes", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <NodeStyle attributes={{ color: "red" }} />
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
          <NodeStyle
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

  it("Sets the attributes for selected nodes correctly", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <NodeStyle.Selected
            attributes={{ color: "red" }}
            fullOverwrite
          />
          <NodeStyle
            attributes={{ color: "grey" }}
          />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ref.current!;
    const nodes = ogma.getNodes();
    nodes.setSelected(true);
    expect(nodes.getAttribute("color")).toStrictEqual([
      "red",
      "red",
      "red",
    ]);
    nodes.setSelected(false);
    await ogma.view.afterNextFrame();
    expect(nodes.getAttribute("color")).toStrictEqual([
      "grey",
      "grey",
      "grey",
    ]);
  });

  it("Sets the attributes for hovered nodes correctly", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <NodeStyle.Hovered
            attributes={{ color: "red" }}
          />
          <NodeStyle
            attributes={{ color: "grey" }}
          />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ref.current!;
    const node = ogma.getNodes().get(0);
    await ogma.mouse.move(ogma.view.graphToScreenCoordinates(node.getPosition()));
    await ogma.view.afterNextFrame();
    await ogma.view.afterNextFrame();
    expect(node.getAttribute("color")).toStrictEqual("red");
    await ogma.mouse.move({x: -1000, y: -1000});
    await ogma.view.afterNextFrame();
    expect(node.getAttribute("color")).toStrictEqual("grey");
  });

  it("NodeStyle cleans up after being removed", async () => {
    const ref = createRef<OgmaLib>();
    const Test = () => {
      const [style, setStyle] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} ref={ref}>
          <button onClick={() => setStyle(!style)}>Click</button>
          {style && <NodeStyle attributes={{ color: "red" }} />}
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
          <EdgeStyle attributes={{ color: "red" }} />
        </Ogma>
      )
    );
  });

  it("Passes edge attributes", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <EdgeStyle attributes={{ color: "red" }} />
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
          <EdgeStyle
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

  it("Sets the attributes for selected edges correctly", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <EdgeStyle.Selected
            attributes={{ color: "red" }}
            fullOverwrite
          />
          <EdgeStyle
            attributes={{ color: "grey" }}
          />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ref.current!;
    const edges = ogma.getEdges();
    edges.setSelected(true);
    expect(edges.getAttribute("color")).toStrictEqual([
      "red",
      "red"
    ]);
    edges.setSelected(false);
    await ogma.view.afterNextFrame();
    expect(edges.getAttribute("color")).toStrictEqual([
      "grey",
      "grey"
    ]);
  });

  it("Sets the attributes for hovered edges correctly", async () => {
    const ref = createRef<OgmaLib>();
    act(() =>
      div.render(
        <Ogma graph={graph} ref={ref}>
          <EdgeStyle.Hovered
            attributes={{ color: "red" }}
          />
          <EdgeStyle
            attributes={{ color: "grey" }}
          />
        </Ogma>
      )
    );
    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ref.current!;
    let edge = ogma.getEdges().get(0);
    const src = edge.getSource();
    const dest = edge.getTarget();
    const midpoint = {
      x: (src.getPosition().x + dest.getPosition().x) / 2,
      y: (src.getPosition().y + dest.getPosition().y) / 2,
    };
    await ogma.mouse.move(ogma.view.graphToScreenCoordinates(midpoint));
    await ogma.view.afterNextFrame();
    await ogma.view.afterNextFrame();
    edge = ogma.getHoveredElement() as Edge;
    expect(edge.getAttribute("color")).toStrictEqual("red");
    await ogma.mouse.move({x: -1000, y: -1000});
    await ogma.view.afterNextFrame();
    expect(edge.getAttribute("color")).toStrictEqual("grey");
  });

  it("EdgeStyle cleans up after being removed", async () => {
    const ref = createRef<OgmaLib>();
    const Test = () => {
      const [style, setStyle] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} ref={ref}>
          <button onClick={() => setStyle(!style)}>Click</button>
          {style && <EdgeStyle attributes={{ color: "red" }} />}
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
