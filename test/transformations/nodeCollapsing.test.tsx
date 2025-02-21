import { NodeCollapsingTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import OgmaLib from "@linkurious/ogma";
describe("Node Collapsing", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<NodeCollapsingTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(1);
  });

  it("Can be disabled", async () => {
    render(<NodeCollapsingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(1);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
  });

  it("Updates criteria", async () => {
    // BUG in ogma, the generator is not updated.
    //TODO: restore this test when the bug is fixed.
    render(<NodeCollapsingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().get(0).getData()).toEqual({
      key1: "value1",
    });
    await userEvent.click(screen.getByText("setCollapse"));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().get(0).getData()).toEqual({
      key2: "value2",
    });
  });
});
