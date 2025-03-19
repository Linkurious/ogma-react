import React from "react";
import { render, screen, waitFor } from "./utils";

import OgmaLib, { RawGraph } from "@linkurious/ogma";
import { Ogma, useOgma } from "../src";
import { vi, describe, it, expect, beforeEach } from "vitest";

const graph: RawGraph = {
  nodes: [
    { id: 0, attributes: { color: "red", x: 0, y: 0 } },
    { id: 1, attributes: { color: "green", x: 25, y: 0 } },
    { id: 2, attributes: { color: "green", x: 25, y: 0 } }
  ],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 }
  ]
};

describe("Ogma", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Ogma container renders without crashing", () => {
    render(<Ogma graph={graph} />, div);
  });

  it("Supports ref interface", () => {
    const ref = React.createRef<OgmaLib>();
    render(<Ogma ref={ref} graph={graph} />, div);
    expect(ref.current).toBeDefined();
    expect(ref.current).toBeInstanceOf(OgmaLib);
  });

  it("Ogma container renders with onReady callback", () => {
    return new Promise((resolve) => {
      render(<Ogma graph={graph} onReady={(ogma) => resolve(ogma)} />, div);
    }).then((ogma) => {
      expect(ogma).toBeInstanceOf(OgmaLib);
    });
  });

  it("Ogma container renders and takes options", () => {
    const backgroundColor = "red";
    const minimumWidth = 500;
    return new Promise((resolve) => {
      const onReady = (ogma: OgmaLib) => {
        const options = ogma.getOptions();
        expect(options.backgroundColor).toBe(backgroundColor);
        expect(options.minimumWidth).toBe(minimumWidth);
        return resolve(null);
      };
      render(
        <Ogma
          graph={graph}
          onReady={onReady}
          options={{ backgroundColor, minimumWidth }}
        />,
        div
      );
    });
  });

  it("Ogma container passes the ogma instance to children", () => {
    return new Promise((resolve) => {
      const Component = () => {
        const ogma = useOgma();
        expect(ogma).toBeInstanceOf(OgmaLib);
        resolve(null);
        return <></>;
      };
      render(
        <Ogma graph={graph}>
          <Component />
        </Ogma>,
        div
      );
    });
  });

  it.only("should handle onNodeClick prop changes correctly", async () => {
    const mockData = {
      nodes: [
        { id: 0, attributes: { color: "red", x: 0, y: 0 } },
        { id: 1, attributes: { color: "green", x: 25, y: 0 } },
        { id: 2, attributes: { color: "green", x: 25, y: 0 } }
      ]
    } as RawGraph;

    const mockOnNodesAdded = vi.fn(() => console.log("onNodesAdded"));
    let ready = false;
    //return new Promise((resolve) => {
    const onReady = () => {
      ready = true;
      //resolve(null);
    };
    const { rerender } = render(
      <Ogma onAddNodes={mockOnNodesAdded} onReady={onReady} />,
      div
    );

    // Wait for Ogma to initialize
    await waitFor(() => ready);

    rerender(<Ogma graph={mockData} onAddNodes={mockOnNodesAdded} />);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if the handler was called
    expect(mockOnNodesAdded).toHaveBeenCalledTimes(1);
    expect(mockOnNodesAdded).toHaveBeenCalledWith(
      expect.objectContaining({ nodeId: "1" })
    );

    // Rerender without the handler
    rerender(<Ogma graph={mockData} />);

    // Simulate another click - handler should not be called
    expect(mockOnNodesAdded).toHaveBeenCalledTimes(1); // Count should not increase
  });
});
