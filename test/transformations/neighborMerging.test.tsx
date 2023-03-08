import { NeighborMergingTest, ref } from "./test-components";
import { render, userEvent, screen } from '../utils'
import OgmaLib from "@linkurious/ogma";
describe("Neighbor merging", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(
      <NeighborMergingTest disabled={true} />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(2);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(1);
      })
  });

  it("Can be disabled", () => {
    render(
      <NeighborMergingTest />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(1);
      })
      .then(() => userEvent.click(screen.getByText('toggle')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(2);
      })
  });

  it("Updates criteria", () => {
    render(
      <NeighborMergingTest />,
      div
    );
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(1);
      })
      .then(() => userEvent.click(screen.getByText('setGenerator')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(0);
      })
  });
});
