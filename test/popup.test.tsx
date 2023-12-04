import { createRef } from "react";
import { render } from "./utils";

import { Ogma, Popup } from "../src";
import { Overlay, Point } from "@linkurious/ogma";
import graph from "./fixtures/simple_graph.json";

describe("Popup", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("should support ref", () => {
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            return { x: bbox.cx, y: bbox.cy };
          }}
          placement="right"
        >
          content
        </Popup>
      </Ogma>,
      div
    );

    expect(ref.current).toBeDefined();
    expect(ref.current!.hide).toBeDefined();
  });
  it("should add popup", () => {
    const text = "Custom popup text";
    const ref = createRef<Overlay>();

    render(
      <Ogma graph={graph}>
        <Popup position={{ x: 0, y: 0 }} ref={ref}>
          <div className="custom-child-div">{text}</div>
        </Popup>
      </Ogma>,
      div
    );
    expect(
      ref.current?.element.querySelector(".ogma-popup--body")
    ).toBeInstanceOf(HTMLElement);
    expect(
      ref.current?.element.querySelector(".ogma-popup--close")
    ).toBeDefined();
    expect(
      ref.current?.element.querySelector(".custom-child-div")
    ).toBeInstanceOf(HTMLElement);
    expect(
      ref.current?.element.querySelector(".custom-child-div")!.textContent
    ).toBe(text);
  });

  it("should support positioning", () => {
    let pos: Point;
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            pos = { x: bbox.cx, y: bbox.cy };
            return pos;
          }}
        >
          Popup
        </Popup>
      </Ogma>,
      div
    );
    expect((ref.current?.element as HTMLDivElement).style.transform).toContain(
      `translate(150px, 150px) rotate(0rad) translate(0px, 0px)`
    );
  });

  it("should support custom className", () => {
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          popupClass="custom-class"
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            return { x: bbox.cx, y: bbox.cy };
          }}
        >
          Popup
        </Popup>
      </Ogma>,
      div
    );
    expect(ref.current?.element.classList.contains("custom-class")).toBe(true);
  });

  it("should support custom close button", () => {
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            return { x: bbox.cx, y: bbox.cy };
          }}
          closeButton={<span className="custom-close-button">X</span>}
        >
          content
        </Popup>
      </Ogma>,
      div
    );
    expect(
      ref.current?.element.querySelector(".custom-close-button")
    ).toBeInstanceOf(HTMLSpanElement);
  });

  it("should support custom bottom placement", () => {
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            return { x: bbox.cx, y: bbox.cy };
          }}
          placement="bottom"
        >
          content
        </Popup>
      </Ogma>,
      div
    );
    expect(
      (ref.current?.element as HTMLDivElement).classList.contains(
        "ogma-popup--bottom"
      )
    ).toBe(true);
  });

  it("should support custom left placement", () => {
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            return { x: bbox.cx, y: bbox.cy };
          }}
          placement="left"
        >
          content
        </Popup>
      </Ogma>,
      div
    );
    expect(
      (ref.current?.element as HTMLDivElement).classList.contains(
        "ogma-popup--left"
      )
    ).toBe(true);
  });

  it("should support custom right placement", () => {
    const ref = createRef<Overlay>();
    render(
      <Ogma graph={graph}>
        <Popup
          ref={ref}
          position={(ogma) => {
            const bbox = ogma.view.getGraphBoundingBox();
            return { x: bbox.cx, y: bbox.cy };
          }}
          placement="right"
        >
          content
        </Popup>
      </Ogma>,
      div
    );
    expect(
      (ref.current?.element as HTMLDivElement).classList.contains(
        "ogma-popup--right"
      )
    ).toBe(true);
  });
});
