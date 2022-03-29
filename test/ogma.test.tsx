import React from "react";
import ReactDOM from "react-dom";
import OgmaLib, { RawGraph } from "@linkurious/ogma";
import { Ogma, useOgma } from "../src";

const graph: RawGraph = {
  nodes: [
    { id: 0, attributes: { color: "red", x: 0, y: 0 } },
    { id: 1, attributes: { color: "green", x: 25, y: 0 } },
    { id: 2, attributes: { color: "green", x: 25, y: 0 } },
  ],
  edges: [
    { source: 0, target: 1 },
    { source: 0, target: 2 },
  ],
};

describe("Ogma", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Ogma container renders without crashing", () => {
    ReactDOM.render(<Ogma graph={graph} />, div);
  });

  it("Ogma container renders with onReady callback", () => {
    const onReady = jest.fn((ogma: OgmaLib) => ogma);
    ReactDOM.render(<Ogma graph={graph} onReady={onReady} />, div);
    expect(onReady).toHaveBeenCalled();
    expect(onReady.mock.calls[0][0]).toBeInstanceOf(OgmaLib);
  });

  it("Ogma container renders and takes options", (done) => {
    const backgroundColor = "red";
    const minimumWidth = 500;
    const onReady = (ogma: OgmaLib) => {
      const options = ogma.getOptions();
      expect(options.backgroundColor).toBe(backgroundColor);
      expect(options.minimumWidth).toBe(minimumWidth);
      done();
    };
    ReactDOM.render(
      <Ogma
        graph={graph}
        onReady={onReady}
        options={{ backgroundColor, minimumWidth }}
      />,
      div
    );
  });

  it("Ogma container passes the ogma instance to children", (done) => {
    const Component = () => {
      const ogma = useOgma();
      expect(ogma).toBeInstanceOf(OgmaLib);
      done();
      return null;
    };
    ReactDOM.render(
      <Ogma graph={graph}>
        <Component />
      </Ogma>,
      div
    );
  });
});
