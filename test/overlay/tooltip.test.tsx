import OgmaLib, { Point, Overlay, Node } from "@linkurious/ogma";
import { render, waitFor, getMiddlePoint } from "../utils";
import { Tooltip } from "../../src/overlay/tooltip";
import { Ogma } from "../../src";
import { act, createRef } from "react";
import graph from "../fixtures/simple_graph.json";

describe("Tooltip", () => {
  let div: HTMLDivElement;
  let ref: React.RefObject<Overlay | null>;
  beforeEach(() => {
    div = document.createElement("div")
    ref = createRef<Overlay>();
  });

  it("should support ref", () => {
    render(
      <Ogma>
        <Tooltip
          ref={ref}
          eventName="edgeHover"
        >
          content
        </Tooltip>
      </Ogma>,
      div
    );

    expect(ref.current).toBeDefined();
    expect(ref.current!.hide).toBeDefined();
  });

  it("should accept children inline", () => {
    const text = "Custom tooltip text";

    render(
      <Ogma>
        <Tooltip eventName="backgroundClick" ref={ref}>
          <div className="custom-child-div">{text}</div>
        </Tooltip>,
      </Ogma>,
      div
    );

    expect(
      ref.current?.element
    ).toBeInstanceOf(HTMLDivElement);
    expect(
      ref.current?.element.querySelector(".custom-child-div")
    ).toBeInstanceOf(HTMLDivElement);
    expect(
      ref.current?.element.querySelector(".custom-child-div")!.textContent
    ).toBe(text);
  });

  it("should accept children as a function", async () => {
    const ogmaRef = createRef<OgmaLib>();

    render(
      <Ogma ref={ogmaRef}>
        <Tooltip eventName="backgroundClick" ref={ref}>
          {(pos: Point) => <div className="custom-child-div">x: {pos.x}, y: {pos.y}</div>}
        </Tooltip>,
      </Ogma>,
      div
    );

    await waitFor(() => expect(ref.current).toBeTruthy());

    // Open the tooltip by clicking on the background
    await act(
      async () => {
        await ogmaRef.current!.mouse.click({ x: 0, y: 0 })
        await ogmaRef.current!.view.afterNextFrame();
        await ogmaRef.current!.view.afterNextFrame();
      }
    );

    // The children do not exist until the tooltip is opened
    expect(
      ref.current?.element.querySelector(".custom-child-div")
    ).toBeInstanceOf(HTMLDivElement);
  });

  it("should show the tooltip on the correct event", async () => {
    const ref1 = createRef<Overlay>();
    const ref2 = createRef<Overlay>();
    const ref3 = createRef<Overlay>();
    const ref4 = createRef<Overlay>();
    const ogmaRef = createRef<OgmaLib>();

    render(
      <Ogma ref={ogmaRef} graph={graph}>
        <Tooltip eventName="nodeHover" ref={ref1}>
          content
        </Tooltip>
        <Tooltip eventName="backgroundClick" ref={ref2}>
          content
        </Tooltip>
        <Tooltip eventName="nodeDoubleclick" ref={ref3}>
          content
        </Tooltip>
        <Tooltip eventName="edgeRightclick" ref={ref4}>
          content
        </Tooltip>
      </Ogma>,
      div
    );

    await waitFor(() => expect(ref1.current).toBeTruthy());

    const ogma = ogmaRef.current!;
    await ogma.layouts.force({ locate: true });
    const node = ogma.getNodes().get(0);
    const edge = ogma.getEdges().get(0);

    const events = [
      {
        ref: ref1,
        showTooltip: async () => {
          await ogma.mouse.move(
            ogma.view.graphToScreenCoordinates(node.getPosition())
          );
          await ogma.view.afterNextFrame();
        },
        hideTooltip: async () => {
          await ogma.mouse.move({ x: -10000, y: -10000 });
          await ogma.view.afterNextFrame();
          await ogma.view.afterNextFrame();
        }
      },
      {
        ref: ref2,
        showTooltip: async () => {
          await ogma.mouse.click({ x: 10000, y: 10000 });
          await ogma.view.afterNextFrame();
        },
        hideTooltip: async () => {
          await ogma.mouse.click(
            ogma.view.graphToScreenCoordinates(node.getPosition())
          );
          await ogma.view.afterNextFrame();
        }
      },
      {
        ref: ref3,
        showTooltip: async () => {
          await ogma.mouse.doubleclick(
            ogma.view.graphToScreenCoordinates(node.getPosition())
          );
          await ogma.view.afterNextFrame();
        },
        hideTooltip: async () => {
          await ogma.mouse.click({ x: -10000, y: -10000 });
          await ogma.view.afterNextFrame();
        }
      },
      {
        ref: ref4,
        showTooltip: async () => {
          await ogma.mouse.rightClick(
            ogma.view.graphToScreenCoordinates(getMiddlePoint(edge)!)
          );
          await ogma.view.afterNextFrame();
        },
        hideTooltip: async () => {
          await ogma.mouse.click({ x: -10000, y: -10000 });
          await ogma.view.afterNextFrame();
        }
      }
    ];

    for (const { ref, showTooltip, hideTooltip } of Object.values(events)) {
      // Show the tooltip by simulating the event
      await act(showTooltip);

      expect(ref.current?.isHidden()).toBe(false);

      // Hide the tooltip by simulating its counterpart event (e.g., moving the mouse away for hover)
      await act(hideTooltip);

      expect(ref.current?.isHidden()).toBe(true);
    }
  });

  it("should render the tooltip dynamically based on the event target", async () => {
    const ogmaRef = createRef<OgmaLib>();

    render(
      <Ogma ref={ogmaRef} graph={graph}>
        <Tooltip eventName="nodeClick" ref={ref}>
          {(node: Node) => <div className="custom-child-div">{node.getId()}</div>}
        </Tooltip>,
      </Ogma>,
      div
    );

    await waitFor(() => expect(ref.current).toBeTruthy());

    const ogma = ogmaRef.current!;
    await ogma.layouts.force({ locate: true });
    const nodes = ogma.getNodes();

    // Simulate clicking the nodes of the graph then check the tooltip content
    for (let i = 0; i < nodes.size; i++) {
      const node = nodes.get(i);
      await act(
        async () => {
          await ogma.mouse.click(
            ogma.view.graphToScreenCoordinates(node.getPosition())
          );
          await ogma.view.afterNextFrame();
        }
      );
  
      expect(
        ref.current?.element.querySelector(".custom-child-div")!.textContent
      ).toBe(`${node.getId()}`);
    }
  });

  it("should support static positioning", async () => {
    const position = { x: 100, y: 100 };
    const ogmaRef = createRef<OgmaLib>();
    render(
      <Ogma ref={ogmaRef}>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          position={position}
          placement="top"
        >
          Static tooltip content
        </Tooltip>,
      </Ogma>,
      div
    );

    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ogmaRef.current!;
    await act(
      async () => {
        await ogma.mouse.click(
          ogma.view.graphToScreenCoordinates({ x: -999, y: -999 })
        );
        await ogma.view.afterNextFrame();
      }
    );
    const rect = ref.current?.element.getBoundingClientRect()!;

    await act(
      async () => {
        await ogma.mouse.click(
          ogma.view.graphToScreenCoordinates({ x: 999, y: 999 })
        );
        await ogma.view.afterNextFrame();
      }
    );
    const rect2 = ref.current?.element.getBoundingClientRect()!;
    expect(rect).toEqual(rect2);
  });

  it("should support static positioning prop changes", async () => {
    const position = { x: 100, y: 100 };
    const ogmaRef = createRef<OgmaLib>();
    const { rerender } = render(
      <Ogma ref={ogmaRef}>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          position={position}
          placement="bottom"
        >
          Static tooltip content
        </Tooltip>,
      </Ogma>,
      div
    );

    await waitFor(() => expect(ref.current).toBeTruthy());
    const ogma = ogmaRef.current!;

    await act(
      async () => {
        await ogma.mouse.click(
          ogma.view.graphToScreenCoordinates({ x: -999, y: -999 })
        );
        await ogma.view.afterNextFrame();
      }
    );
    const rect = ref.current?.element.getBoundingClientRect()!;

    await act(
      async () => {
        await ogma.mouse.click(
          ogma.view.graphToScreenCoordinates({ x: 999, y: 999 })
        );
        await ogma.view.afterNextFrame();
      }
    );
    const rect2 = ref.current?.element.getBoundingClientRect()!;
    expect(rect).toEqual(rect2);

    const newPosition = { x: 200, y: 200 };
    rerender(
      <Ogma ref={ogmaRef}>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          position={newPosition}
          placement="bottom"
        >
          Static tooltip content
        </Tooltip>
      </Ogma>
    );

    await waitFor(() => expect(ref.current).toBeTruthy());
    await act(
      async () => {
        await ogma.mouse.click(
          ogma.view.graphToScreenCoordinates({ x: 999, y: 999 })
        );
        await ogma.view.afterNextFrame();
      }
    );
    const newRect = ref.current?.element.getBoundingClientRect()!;
    expect(newRect).not.toEqual(newPosition);
    await act(
      async () => {
        await ogma.mouse.click(
          ogma.view.graphToScreenCoordinates({ x: -999, y: -999 })
        );
        await ogma.view.afterNextFrame();
      }
    );
    const newRect2 = ref.current?.element.getBoundingClientRect()!;
    expect(newRect).toEqual(newRect2);
  });

  it("should support sizing", () => {
    render(
      <Ogma>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          size={{ width: 300, height: 200 }}
        >
          Sized tooltip content
        </Tooltip>,
      </Ogma>,
      div
    );

    expect(ref.current?.element.style.width).toBe("300px");
    expect(ref.current?.element.style.height).toBe("200px");
  });

  it("should support sizing prop changes", async () => {
    const { rerender } = render(
      <Ogma>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          size={{ width: 300, height: 200 }}
        >
          Sized tooltip content
        </Tooltip>,
      </Ogma>,
      div
    );

    expect(ref.current?.element.style.width).toBe("300px");
    expect(ref.current?.element.style.height).toBe("200px");

    rerender(
      <Ogma>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          size={{ width: 400, height: 300 }}
        >
          Sized tooltip content
        </Tooltip>
      </Ogma>
    );

    expect(ref.current?.element.style.width).toBe("400px");
    expect(ref.current?.element.style.height).toBe("300px");
  });

  it("should support placement", () => {
    const ref2 = createRef<Overlay>();
    const ref3 = createRef<Overlay>();
    const ref4 = createRef<Overlay>();
    render(  
      <Ogma>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          placement="top"
        >
          Tooltip content
        </Tooltip>
        <Tooltip
          ref={ref2}
          eventName="backgroundClick"
          placement="right"
        >
          Tooltip content
        </Tooltip>
        <Tooltip
          ref={ref3}
          eventName="backgroundClick"
          placement="bottom"
        >
          Tooltip content
        </Tooltip>
        <Tooltip
          ref={ref4}
          eventName="backgroundClick"
          placement="left"
        >
          Tooltip content
        </Tooltip>
      </Ogma>,
      div
    );

    expect(
      (ref.current?.element.firstElementChild as HTMLDivElement).style.transform
    ).toBe("translate(calc(-50% + 0px), calc(-100% + 0px))");
    expect(
      (ref2.current?.element.firstElementChild as HTMLDivElement).style.transform
    ).toBe("translate(0px, calc(-50% + 0px))");
    expect(
      (ref3.current?.element.firstElementChild as HTMLDivElement).style.transform
    ).toBe("translate(calc(-50% + 0px), 0px)");
    expect(
      (ref4.current?.element.firstElementChild as HTMLDivElement).style.transform
    ).toBe("translate(calc(-100% + 0px), calc(-50% + 0px))");
  });

  it("should support translation", () => {
    const translate = { x: 10, y: 20 };
    render(
      <Ogma>
        <Tooltip
          ref={ref}
          eventName="backgroundClick"
          placement="top"
          translate={translate}
        >
          Translated tooltip content
        </Tooltip>
      </Ogma>,
      div
    );

    expect(
      (ref.current?.element.firstElementChild as HTMLDivElement).style.transform
    ).toBe("translate(calc(-50% + 10px), calc(-100% + 20px))");
  });

});