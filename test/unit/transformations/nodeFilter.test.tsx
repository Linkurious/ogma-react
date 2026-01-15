import { NodeFilterTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import { Ogma as OgmaLib } from "@linkurious/ogma";
describe("Node filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<NodeFilterTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0]);
  });

  it("Can be disabled", async () => {
    render(<NodeFilterTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
  });

  it("Updates criteria", async () => {
    render(<NodeFilterTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0]);
    await act(() => userEvent.click(screen.getByText("setCriteria")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([1]);
  });
});
