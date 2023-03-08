import { EdgeGroupingTest, ref } from "./test-components";
import { render, userEvent, screen } from '../utils'
describe("Edge grouping", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(
      <EdgeGroupingTest disabled={true} />,
      div
    );
    return ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 1, 2, 3]);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 2, `group-1[0-2]`]);
      })
  });

  it("Can be disabled", () => {
    render(
      <EdgeGroupingTest />,
      div
    );
    return ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 2, `group-1[0-2]`]);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 1, 2, 3]);
      })
  });

  it("Updates grouping", () => {
    render(
      <EdgeGroupingTest />,
      div
    );
    return ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 2, `group-1[0-2]`]);
      })
      .then(() => userEvent.click(screen.getByText('setGrouping')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([`group-1[0-2]`, `group-0[0-1]`]);
      })
  });
});
