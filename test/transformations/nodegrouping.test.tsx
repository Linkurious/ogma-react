import React from "react";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import OgmaLib, { Transformation } from "@linkurious/ogma";
import { Ogma, NodeGrouping } from "../../src";
import graph from "../fixtures/simple_graph.json";

describe("Node grouping", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Node grouping component renders without crashing", () => {
    render(
      <Ogma graph={graph}>
        <NodeGrouping groupIdFunction={(node) => node.getId().toString()} />
      </Ogma>,
      div
    );
  });

  it("should provide a transformation ref", () => {
    const ref = React.createRef<Transformation>();
    render(
      <Ogma graph={graph}>
        <NodeGrouping
          ref={ref}
          groupIdFunction={(node) => node.getId().toString()}
        />
      </Ogma>,
      div
    );
    expect(ref.current).toBeDefined();
  });

  it("should group nodes correctly", (done) => {
    const ref = React.createRef<OgmaLib>();
    render(
      <Ogma graph={graph} ref={ref}>
        <NodeGrouping
          groupIdFunction={(node) => (node.getId() > 0 ? "grouped" : undefined)}
        />
      </Ogma>,
      div
    );
    ref.current?.view
      .afterNextFrame()
      .then(() => {
        expect(ref.current?.getNodes().size).toBe(2);
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
          {grouped && (
            <NodeGrouping
              groupIdFunction={(node) =>
                node.getId() > 0 ? "grouped" : undefined
              }
            />
          )}
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
        done();
      })
      .catch(done);
  });

  it("should ungroup when the transformation is disabled", () => {
    const ogmaRef = React.createRef<OgmaLib>();
    const transformationRef = React.createRef<Transformation>();
    const Test = () => {
      const [grouped, setGrouped] = React.useState<boolean>(true);
      return (
        <Ogma graph={graph} ref={ogmaRef}>
          <button onClick={() => setGrouped(!grouped)}>Click</button>
          <NodeGrouping
            ref={transformationRef}
            disabled={!grouped}
            groupIdFunction={(node) =>
              node.getId() > 0 ? "grouped" : undefined
            }
          />
        </Ogma>
      );
    };

    act(() => {
      render(<Test />, div);
    });
    const button = div.querySelector("button") as HTMLButtonElement;
    expect(ogmaRef.current!.transformations.getList().length).toBe(1);
    expect(ogmaRef.current!.getNodes().size).toBe(3);
    expect(
      ogmaRef.current?.transformations.getList().map((t) => t.isEnabled())
    ).toStrictEqual([false]);

    act(() => button.click());
  });
});
