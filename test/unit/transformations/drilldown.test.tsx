import { DrilldownTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act, createRef } from "react";
import { Ogma as OgmaLib } from "@linkurious/ogma";
import { Drilldown } from "../../../src";

describe("Drilldown", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", async () => {
    const drilldownRef = createRef<Drilldown<any, any>>();
    render(<DrilldownTest ref={drilldownRef} disabled={true} />, div);
    await (ref.current as OgmaLib).transformations.afterNextUpdate();
    const node0 = (ref.current as OgmaLib).getNode(0)!;
    drilldownRef.current?.drill(node0);
    expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
    await act(() => userEvent.click(screen.getByText("toggle")));
    await ref.current?.transformations.afterNextUpdate();
    await ref.current?.transformations.afterNextUpdate();
    expect(ref.current?.getNodes().getId()).toEqual(["0 - 1", 1, 2, "0 - 2", "0 - 3", "0 - 4", "ogma-group-0"]);
  });
});
