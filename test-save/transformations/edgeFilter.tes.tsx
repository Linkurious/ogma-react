import OgmaLib from "@linkurious/ogma";
// import { Ogma, EdgeFilter, EdgeFilterProps } from "../../src";
import { EdgeFilterTest } from "./EdgeFilter-test";
import { describe, expect, it } from 'vitest';
import { render, createRef, screen, userEvent } from '@testing-library/react';

describe("Edge filter", () => {
  let div: HTMLDivElement;
  beforeEach(() => (div = document.createElement("div")));

  it("Edge filter component renders without crashing", (done) => {
    const ref = createRef<OgmaLib>();
    render(
      <EdgeFilterTest ref={ref} />,
      div
    );
    userEvent.click(screen.getByText('setCriteria'));
    return ref.current?.transformations
      .afterNextUpdate()
      .then(() => {
        expect(ref.current?.getEdges().size).toBe(1);
      })
      .catch(done);
  });
});
