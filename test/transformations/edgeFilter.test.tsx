import { EdgeFilterTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import OgmaLib from "@linkurious/ogma";
describe("Edge filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(<EdgeFilterTest disabled={true} />, div);
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 1]);
      })
      .then(() => userEvent.click(screen.getByText("toggle")))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0]);
      });
  });

  it("Can be disabled", () => {
    render(<EdgeFilterTest />, div);
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0]);
      })
      .then(() => userEvent.click(screen.getByText("toggle")))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0, 1]);
      });
  });

  it("Updates criteria", () => {
    render(<EdgeFilterTest />, div);
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0]);
      })
      .then(() => userEvent.click(screen.getByText("setCriteria")))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([1]);
      });
  });
});
