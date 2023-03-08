import { EdgeFilterTest, ref } from "./EdgeFilter-test";
import { render, userEvent, screen } from './utils'
describe("Edge filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Edge filter component renders without crashing", () => {
    render(
      <EdgeFilterTest />,
      div
    );
    return ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([0]);
      })
      .then(() => userEvent.click(screen.getByText('setCriteria')))
      .then(() => ref.current?.transformations.afterNextUpdate())
      .then(() => {
        expect(ref.current?.getEdges().getId()).toEqual([1]);
      })
  });
});
