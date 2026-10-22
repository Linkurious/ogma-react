import { NodeGroupingTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import { Ogma as OgmaLib } from "@linkurious/ogma";
describe("Node grouping", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    render(<NodeGroupingTest disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 2, `group-1`]);
  });

  it("Can be disabled", async () => {
    render(<NodeGroupingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 2, `group-1`]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
  });

  it("Updates grouping", async () => {
    render(<NodeGroupingTest />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([0, 2, `group-1`]);
    await act(() => userEvent.click(screen.getByText("setGrouping")));
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual([`group-1`, `group-0`]);
  });

  it("Triggers callbacks", async () => {
    const states = { onEnabled: false, onDestroyed: false, onUpdated: false };
    render(
      <NodeGroupingTest
        onEnabled={() => (states.onEnabled = true)}
        onDestroyed={() => (states.onDestroyed = true)}
        onUpdated={() => (states.onUpdated = true)}
      />,
      div
    );
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    expect(states).toEqual({
      onEnabled: true,
      onDestroyed: false,
      onUpdated: false
    });
    await act(() => userEvent.click(screen.getByText("setGrouping")));
    await ref.current?.transformations.afterNextUpdate();
    expect(states).toEqual({
      onEnabled: true,
      onDestroyed: false,
      onUpdated: true
    });
  });
});
