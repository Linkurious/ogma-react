import React, { act } from "react";
import { Layer as OgmaLayer } from "@linkurious/ogma";
import { Layer, Ogma } from "../../../src";
import { render } from "../utils";

describe("Layer", () => {
  it("should support ref", () => {
    const ref = React.createRef<OgmaLayer>();
    render(
      <Ogma>
        <Layer ref={ref} />
      </Ogma>
    );

    expect(ref.current).toBeDefined();
  });

  it("should render children in the layer", () => {
    const ref = React.createRef<OgmaLayer>();
    render(
      <Ogma>
        <Layer ref={ref}>
          <div>Test Layer Content</div>
        </Layer>
      </Ogma>
    );

    expect(ref.current?.element).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.element.innerHTML).toContain("Test Layer Content");
  });

  it("should handle className", () => {
    const ref = React.createRef<OgmaLayer>();
    render(
      <Ogma>
        <Layer className="test-layer" ref={ref}>
          <div>Layer with Class</div>
        </Layer>
      </Ogma>
    );

    expect(ref.current?.element.className).toContain("test-layer");
  });

  it("should handle className changes", () => {
    const ref = React.createRef<OgmaLayer>();
    const { rerender } = render(
      <Ogma>
        <Layer className="initial-class" ref={ref}>
          <div>Layer with Initial Class</div>
        </Layer>
      </Ogma>
    );
    expect(ref.current?.element.className).toContain("initial-class");
    rerender(
      <Ogma>
        <Layer className="updated-class" ref={ref}>
          <div>Layer with Updated Class</div>
        </Layer>
      </Ogma>
    );
    expect(ref.current?.element.className).toContain("updated-class");
    expect(ref.current?.element.className).not.toContain("initial-class");
  });
 
  it("should handle index", () => {
    const ref = React.createRef<OgmaLayer>();
    render(
      <Ogma>
        <Layer index={1} ref={ref}>
          <div>Layer with Index</div>
        </Layer>
      </Ogma>
    );

    expect(ref.current?.getLevel()).toEqual(1);
  });

  it("should handle index changes", () => {
    const ref = React.createRef<OgmaLayer>();
    const { rerender } = render(
      <Ogma>
        <Layer index={0} ref={ref}>
          <div>Layer with Initial Index</div>
        </Layer>
      </Ogma>
    );
    expect(ref.current?.getLevel()).toEqual(0);
    rerender(
      <Ogma>
        <Layer index={1} ref={ref}>
          <div>Layer with Second Index</div>
        </Layer>
      </Ogma>
    );
    expect(ref.current?.getLevel()).toEqual(1);
  });

  it("should clean up on unmount", async () => {
    const ref = React.createRef<OgmaLayer>();
    const { unmount } = render(
      <Ogma>
        <Layer ref={ref}>
        </Layer>
      </Ogma>
    );
    expect(ref.current).toBeDefined();

    await act(async () => {
      unmount();
    });
    expect(ref.current).toBeNull();
  });
});