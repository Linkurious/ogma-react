import { EdgeGroupingTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import OgmaLib from "@linkurious/ogma";
describe("Edge grouping", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<EdgeGroupingTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 1, 2, 3]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 2, `group-1[0-2]`]);
  });

  it("Can be disabled", async () => {
    render(<EdgeGroupingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 2, `group-1[0-2]`]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 1, 2, 3]);
  });

  it("Updates grouping", async () => {
    render(<EdgeGroupingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 2, `group-1[0-2]`]);
    await act(() => userEvent.click(screen.getByText("setGrouping")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([
      `group-1[0-2]`,
      `group-0[0-1]`,
    ]);
  });
});
