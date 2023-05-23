import { NodeGroupingTest, ref } from "./test-components";
import { render, userEvent, screen } from '../utils'
import OgmaLib from "@linkurious/ogma";
describe("Node grouping", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(
      <NodeGroupingTest disabled={true} />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0, 2, `group-1`]);
      })
  });

  it("Can be disabled", () => {
    render(
      <NodeGroupingTest />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0, 2, `group-1`]);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
      })
  });

  it("Updates grouping", () => {
    render(
      <NodeGroupingTest />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0, 2, `group-1`]);
      })
      .then(() => userEvent.click(screen.getByText('setGrouping')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([`group-1`, `group-0`]);
      })
  });
  it("Triggers callbacks", () => {
    let count = 0;
    render(
      <NodeGroupingTest
        onEnabled={() => { count = count | 2; }}
        onDestroyed={() => { count = count | 4; }}
        onUpdated={() => { count = count | 8; }}
      />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(count).toEqual(2);
      })
      .then(() => userEvent.click(screen.getByText('setGrouping')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(count).toEqual(10);
      })
  });
});
