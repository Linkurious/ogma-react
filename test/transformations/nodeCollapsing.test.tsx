import { NodeCollapsingTest, ref } from "./test-components";
import { render, userEvent, screen } from '../utils'
describe("Node Collapsing", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Can be disabled by default and then enabled", () => {
    render(
      <NodeCollapsingTest disabled={true} />,
      div
    );
    return ref.current?.transformations
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
      <NodeCollapsingTest />,
      div
    );
    return ref.current?.transformations
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
    // BUG in ogma, the generator is not updated.
    //TODO: restore this test when the bug is fixed.
    // render(
    //   <NodeCollapsingTest />,
    //   div
    // );
    // return ref.current?.transformations
    //   .afterNextUpdate()
    //   .then(() => {
    //     expect(ref.current?.getEdges().get(0).getData()).toEqual({ key1: 'value1' });
    //   })
    //   .then(() => userEvent.click(screen.getByText('setCollapse')))
    //   .then(() => ref.current?.transformations.afterNextUpdate())
    //   .then(() => {
    //     console.log(ref.current?.getEdges().getData())
    //     expect(ref.current?.getEdges().get(0).getData()).toEqual({ key2: 'value2' });
    //   })
  });
});
