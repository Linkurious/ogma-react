import React from "react";
import { render } from "./utils";

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
});
