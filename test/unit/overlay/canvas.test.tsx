import { render } from "../utils";
import { CanvasLayer, Ogma } from "../../../src";
import { CanvasLayer as OgmaCanvasLayer } from "@linkurious/ogma/dev";
import React, { act } from "react";

describe("Canvas Overlay", () => {
  it("should support ref", () => {
    const ref = React.createRef<OgmaCanvasLayer>();
    render(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, 100, 100);
          }}
          ref={ref}
        />
      </Ogma>
    );

    expect(ref.current).toBeDefined();
  });

  it("should handle visibility", () => {
    const ref = React.createRef<OgmaCanvasLayer>();
    render(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, 100, 100);
          }}
          ref={ref}
          visible={false}
        />
      </Ogma>
    );

    expect(ref.current?.isHidden()).toBe(true);
  });

  it("should handle visibility change", () => {
    const ref = React.createRef<OgmaCanvasLayer>();
    const { rerender } = render(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, 100, 100);
          }}
          visible={true}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.isHidden()).toBe(false);

    rerender(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "green";
            ctx.fillRect(0, 0, 100, 100);
          }}
          visible={false}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.isHidden()).toBe(true);
  });

  it("should handle index", () => {
    const ref = React.createRef<OgmaCanvasLayer>();
    render(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "yellow";
            ctx.fillRect(0, 0, 100, 100);
          }}
          index={1}
          ref={ref}
        />
      </Ogma>
    );

    expect(ref.current?.getLevel()).toEqual(1);
  });

  it("should handle index changes", () => {
    const ref = React.createRef<OgmaCanvasLayer>();
    const { rerender } = render(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "orange";
            ctx.fillRect(0, 0, 100, 100);
          }}
          index={0}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.getLevel()).toEqual(0);

    rerender(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "orange";
            ctx.fillRect(0, 0, 100, 100);
          }}
          index={1}
          ref={ref}
        />
      </Ogma>
    );
    expect(ref.current?.getLevel()).toEqual(1);
  });

  it("should clean up on unmount", async () => {
    const ref = React.createRef<OgmaCanvasLayer>();
    const { unmount } = render(
      <Ogma>
        <CanvasLayer
          render={(ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "purple";
            ctx.fillRect(0, 0, 100, 100);
          }}
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