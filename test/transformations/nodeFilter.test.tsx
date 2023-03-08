import { NodeFilterTest, ref } from "./test-components";
import { render, userEvent, screen } from '../utils'
import OgmaLib from "@linkurious/ogma";
describe("Node filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(
      <NodeFilterTest disabled={true} />,
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
        expect(ref.current?.getNodes().getId()).toEqual([0]);
      })
  });

  it("Can be disabled", () => {
    render(
      <NodeFilterTest />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0]);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0, 1, 2]);
      })
  });

  it("Updates criteria", () => {
    render(
      <NodeFilterTest />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([0]);
      })
      .then(() => userEvent.click(screen.getByText('setCriteria')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getNodes().getId()).toEqual([1]);
      })
  });
});
