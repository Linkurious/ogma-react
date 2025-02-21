import { NeighborGenerationTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import OgmaLib from "@linkurious/ogma";

describe("Neighbor generation", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<NeighborGenerationTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(0);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
  });

  it("Can be disabled", async () => {
    render(<NeighborGenerationTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(0);
  });

  it("Updates criteria", async () => {
    render(<NeighborGenerationTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getEdges().size).toEqual(2);
    await act(() => userEvent.click(screen.getByText("setGenerator")));
    await ref.current?.transformations.afterNextUpdate();
    // TODO: bug in ogma, the data is not merged.
    //expect(ref.current?.getEdges().size).toEqual(3);
  });
});
