import React from "react";
import { render } from "react-dom";
import { Ogma, Popup } from "../src/";
import { Point } from "@linkurious/ogma";
import graph from "./fixtures/simple_graph.json";

describe("Popup", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("should add popup", () => {
    const text = "Custom popup text";
    render(
      <Ogma graph={graph}>
        <Popup position={{ x: 0, y: 0 }}>
          <div className="custom-child-div">{text}</div>
        </Popup>
      </Ogma>,
      div
    );
    expect(div.querySelector(".ogma-popup")).toBeInstanceOf(HTMLElement);
    expect(div.querySelector(".ogma-popup--close")).toBeDefined();
    expect(div.querySelector(".custom-child-div")).toBeInstanceOf(HTMLElement);
    expect(div.querySelector(".custom-child-div")!.textContent).toBe(text);
  });

  it("should support positioning", () => {
    let pos: Point;
    render(
      <Ogma graph={graph}>
        <Popup
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
    expect(
      (div.querySelector(".ogma-popup") as HTMLDivElement).style.transform
    ).toContain(`translate(150px, 150px) rotate(0rad) translate(0px, 0px)`);
  });

  it("should support custom className", () => {
    render(
      <Ogma graph={graph}>
        <Popup
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
    expect(div.querySelector(".custom-class")).toBeInstanceOf(HTMLElement);
  });

  it("should support custom close button", () => {
    render(
      <Ogma graph={graph}>
        <Popup
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
    expect(div.querySelector(".custom-close-button")).toBeInstanceOf(
      HTMLSpanElement
    );
  });

  it("should support custom bottom placement", () => {
    render(
      <Ogma graph={graph}>
        <Popup
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
      (div.querySelector(".ogma-popup") as HTMLDivElement).classList.contains(
        "ogma-popup--bottom"
      )
    ).toBe(true);
  });

  it("should support custom left placement", () => {
    render(
      <Ogma graph={graph}>
        <Popup
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
      (div.querySelector(".ogma-popup") as HTMLDivElement).classList.contains(
        "ogma-popup--left"
      )
    ).toBe(true);
  });

  it("should support custom right placement", () => {
    render(
      <Ogma graph={graph}>
        <Popup
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
      (div.querySelector(".ogma-popup") as HTMLDivElement).classList.contains(
        "ogma-popup--right"
      )
    ).toBe(true);
  });
});
