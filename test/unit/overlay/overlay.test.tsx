import { Ogma } from "../../../src";
import { Overlay } from "../../../src";
import { render } from "../utils";
import React, { act } from "react";
import { Overlay as OgmaOverlay } from "@linkurious/ogma";

describe("Overlay", () => {
  it("should support ref", () => {
    const ref = React.createRef<OgmaOverlay>();
    render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
        />
      </Ogma>
    );

    expect(ref.current).toBeDefined();
  });

  it("should handle position", () => {
    const ref = React.createRef<OgmaOverlay>();
    render(
      <Ogma>
        <Overlay
          position={{ x: 100, y: 200 }}
          ref={ref}
        />
      </Ogma>
    );

    expect(ref.current?.element.style.transform).toContain("translate(100px, 200px)");
  });

  it("should handle position function", () => {
    const ref = React.createRef<OgmaOverlay>();
    const position = () => ({ x: 50, y: 50 });
    render(
      <Ogma>
        <Overlay
          position={position}
          ref={ref}
        />
      </Ogma>
    );

    expect(ref.current?.element.style.transform).toContain("translate(50px, 50px)");
  });

  it("should handle position changes", () => {
    const ref = React.createRef<OgmaOverlay>();
    const { rerender } = render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.element.style.transform).toContain("translate(0px, 0px)");
    rerender(
      <Ogma>
        <Overlay
          position={{ x: 100, y: 100 }}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.element.style.transform).toContain("translate(100px, 100px)");
  });

  it("should handle index", () => {
    const ref = React.createRef<OgmaOverlay>();
    render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
          index={1}
        />
      </Ogma>
    );
    expect(ref.current?.getLevel()).toEqual(1);
  });

  it("should handle index changes", async () => {
    const ref = React.createRef<OgmaOverlay>();
    const ref2 = React.createRef<OgmaOverlay>();
    const { rerender } = render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
          index={0}
        />
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref2}
          index={1}
        />
      </Ogma>
    );
    expect(ref.current?.getLevel()).toEqual(0);
    expect(ref2.current?.getLevel()).toEqual(1);
    rerender(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
          index={2}
        />
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref2}
          index={1}
        />
      </Ogma>
    );
    expect(ref2.current?.getLevel()).toEqual(1);
    expect(ref.current?.getLevel()).toEqual(2);
  });

  it("should handle size", () => {
    const ref = React.createRef<OgmaOverlay>();
    render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
          size={{ width: 100, height: 100 }}
        />
      </Ogma>
    );

    expect(ref.current?.element.style.width).toEqual("100px");
    expect(ref.current?.element.style.height).toEqual("100px");
  });

  it("should handle className", () => {
    const ref = React.createRef<OgmaOverlay>();
    render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          className="test-class"
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.element.className).toContain("test-class");
  });

  it("should handle className changes", () => {
    const ref = React.createRef<OgmaOverlay>();
    const { rerender } = render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          className="initial-class"
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.element.className).toContain("initial-class");

    rerender(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          className="updated-class"
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.element.className).toContain("updated-class");
    expect(ref.current?.element.className).not.toContain("initial-class");
  });

  it("should contain children", () => {
    const ref = React.createRef<OgmaOverlay>();
    render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
        >
          <div className="child">Child Content</div>
        </Overlay>
      </Ogma>
    );

    expect(ref.current?.element.querySelector(".child")).toBeDefined();
    expect(ref.current?.element.querySelector(".child")?.textContent).toEqual("Child Content");
  });

  it("should clean up on unmount", async () => {
    const ref = React.createRef<OgmaOverlay>();
    const { unmount } = render(
      <Ogma>
        <Overlay
          position={{ x: 0, y: 0 }}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current).toBeDefined();
    await act(async () => {
      unmount();
    });
    expect(ref.current).toBeNull();
  });
});