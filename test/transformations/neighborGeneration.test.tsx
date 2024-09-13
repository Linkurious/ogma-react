import { NeighborGenerationTest, ref } from "./test-components";
import { render, userEvent, screen } from "../utils";
import { act } from "react";
import OgmaLib from "@linkurious/ogma";
describe("Neighbor generation", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(<NeighborGenerationTest disabled={true} />, div);
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(0);
      })
      .then(() => act(() => userEvent.click(screen.getByText("toggle"))))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(2);
      });
  });

  it("Can be disabled", () => {
    render(<NeighborGenerationTest />, div);
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(2);
      })
      .then(() => act(() => userEvent.click(screen.getByText("toggle"))))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(0);
      });
  });

  it("Updates criteria", () => {
    render(<NeighborGenerationTest />, div);
    return (ref.current as OgmaLib).transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(2);
      })
      .then(() => act(() => userEvent.click(screen.getByText("setGenerator"))))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().size).toEqual(3);
      });
  });
});
