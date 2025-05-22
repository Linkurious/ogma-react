import React from "react";
import { render, waitFor } from "./utils";

import OgmaLib, { RawGraph } from "@linkurious/ogma";
import { Ogma, useOgma } from "../src";
import { Theme } from "../src/types";
import { afternoonNap, morningBreeze } from '@linkurious/ogma-styles';
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

  it("should handle onNodesAdded prop changes correctly", async () => {
    const mockData = {
      nodes: [
        { id: 0, attributes: { color: "red", x: 0, y: 0 } },
        { id: 1, attributes: { color: "green", x: 25, y: 0 } },
      ]
    } as RawGraph;

    const mockOnNodesAdded = vi.fn(() => console.log("onNodesAdded"));
    let ready = false;

    const ref = React.createRef<OgmaLib>();
    const onReady = () => {
      ready = true;
    };

    const { rerender } = render(
      <Ogma ref={ref} graph={mockData} onAddNodes={mockOnNodesAdded} onReady={onReady} />,
      div
    );

    // Wait for Ogma to initialize
    await waitFor(() => ready);

    // add a node
    ref.current?.addNode({ id: 2, attributes: { color: "blue", x: 0, y: 25 } });

    // Check if the handler was called
    expect(mockOnNodesAdded).toHaveBeenCalledTimes(1);

    // Rerender without the handler
    rerender(<Ogma ref={ref} graph={mockData} />);

    ref.current?.addNode({ id: 3, attributes: { color: "yellow", x: 25, y: 25 } });

    // add another node - handler should not be called
    expect(mockOnNodesAdded).toHaveBeenCalledTimes(1);

    rerender(<Ogma ref={ref} graph={mockData} onAddNodes={mockOnNodesAdded} />);

    ref.current?.addNode({ id: 4, attributes: { color: "purple", x: 50, y: 50 } });

    // Check if the handler was called again
    expect(mockOnNodesAdded).toHaveBeenCalledTimes(2);
  });

  it("should set the theme of the graph correctly with the prop changes", async () => {
    const mockData = {
      nodes: [
        { id: 0, attributes: { x: 0, y: 0 } },
      ]
    } as RawGraph;

    const theme: Theme = afternoonNap as Theme<unknown, unknown>;
    let ready = false;
    const ref = React.createRef<OgmaLib>();
    const onReady = () => {
      ready = true;
    };

    const { rerender } = render(
      <Ogma ref={ref} graph={mockData} theme={theme} onReady={onReady} />,
      div
    );

    await waitFor(() => ready);

    // node color should be the theme's node color
    const nodeColor = ref.current?.getNodes().get(0).getAttribute("color");
    expect(nodeColor).toMatch("#BD8A61");

    const theme2: Theme = morningBreeze as Theme<unknown, unknown>;
    rerender(<Ogma ref={ref} graph={mockData} theme={theme2} />)

    // node color should be the new theme's node color after rerendering
    const nodeColor2 = ref.current?.getNodes().get(0).getAttribute("color");
    expect(nodeColor2).toMatch("#43a2ca");

  })
});
