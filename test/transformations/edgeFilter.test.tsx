import { EdgeFilterTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import OgmaLib from "@linkurious/ogma";
describe("Edge filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<EdgeFilterTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 1]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0]);
  });

  it("Can be disabled", async () => {
    render(<EdgeFilterTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0, 1]);
  });

  it("Updates criteria", async () => {
    render(<EdgeFilterTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([0]);
    await act(() => userEvent.click(screen.getByText("setCriteria")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().getId()).toEqual([1]);
  });
});
