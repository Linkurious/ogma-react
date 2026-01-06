import { NeighborMergingTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import { Ogma as OgmaLib } from "@linkurious/ogma";
describe("Neighbor merging", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<NeighborMergingTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(1);
  });

  it("Can be disabled", async () => {
    render(<NeighborMergingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(1);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
  });

  it("Updates criteria", async () => {
    render(<NeighborMergingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(1);
    await act(() => userEvent.click(screen.getByText("setGenerator")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(0);
  });
});
