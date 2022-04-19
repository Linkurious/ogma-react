import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import OgmaLib, { Transformation } from "@linkurious/ogma";
import { Ogma, EdgeGrouping } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("Edge grouping", () => {
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

  it("should provide a transformation ref", () => {
    const ref = React.createRef<Transformation>();
    render(
      <Ogma graph={graph}>
        <EdgeGrouping
          ref={ref}
          groupIdFunction={(node) => node.getId().toString()}
        />
      </Ogma>,
      div
    );
    expect(ref.current).toBeDefined();
  });

  it("should group edges correctly", (done) => {
    const ref = React.createRef<OgmaLib>();
    const graphWithDoubleEdge = {
      ...graph,
      edges: [
        ...graph.edges,
        {
          id: graph.edges.length + 1,
          source: graph.edges[0].source,
          target: graph.edges[0].target,
        },
      ],
    };
    render(
      <Ogma graph={graphWithDoubleEdge} ref={ref}>
        <EdgeGrouping />
      </Ogma>,
      div
    );
    ref.current?.view
      .afterNextFrame()
      .then(() => {
        expect(ref.current?.getEdges().size).toBe(2);
        done();
      })
      .catch(done);
  });

  it("should ungroup when the transformation is removed", (done) => {
    const ogmaRef = React.createRef<OgmaLib>();
    const Test = () => {
      const [grouped, setGrouped] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} ref={ogmaRef}>
          <button onClick={() => setGrouped(!grouped)}>Click</button>
          {grouped && <EdgeGrouping />}
        </Ogma>
      );
    };

    act(() => {
      render(<Test />, div);
    });
    const button = div.querySelector("button") as HTMLButtonElement;
    act(() => button.click());
    ogmaRef
      .current!.transformations.afterNextUpdate()
      .then(() => {
        expect(ogmaRef.current!.transformations.getList().length).toBe(0);
        expect(ogmaRef.current!.getEdges().getId()).toStrictEqual([0, 1]);
        done();
      })
      .catch(done);
  });

  it("should ungroup when the transformation is disabled", () => {
    const ogmaRef = React.createRef<OgmaLib>();
    const transformationRef = React.createRef<Transformation>();
    const graphWithDoubleEdge = {
      ...graph,
      edges: [
        ...graph.edges,
        {
          id: graph.edges.length + 1,
          source: graph.edges[0].source,
          target: graph.edges[0].target,
        },
      ],
    };
    const Test = () => {
      const [grouped, setGrouped] = React.useState<boolean>(true);
      return (
        <Ogma graph={graphWithDoubleEdge} ref={ogmaRef}>
          <button onClick={() => setGrouped(!grouped)}>Click</button>
          <EdgeGrouping ref={transformationRef} disabled={!grouped} />
        </Ogma>
      );
    };

    act(() => {
      render(<Test />, div);
    });
    const button = div.querySelector("button") as HTMLButtonElement;
    expect(ogmaRef.current!.transformations.getList().length).toBe(1);
    expect(ogmaRef.current!.getEdges().size).toBe(3);
    expect(
      ogmaRef.current?.transformations.getList().map((t) => t.isEnabled())
    ).toStrictEqual([false]);

    act(() => button.click());
  });
});
