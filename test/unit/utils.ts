/* eslint-disable import/export */
import { Edge } from "@linkurious/ogma";
import { cleanup, render } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// @ts-ignore
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options
  });

const getMiddlePoint = (edge: Edge) => {
  const source = edge.getSource();
  const target = edge.getTarget();
  if (!source || !target) return null;
  return {
    x: (source.getPosition().x + target.getPosition().x) / 2,
    y: (source.getPosition().y + target.getPosition().y) / 2
  };
}

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render export
export { customRender as render };
export { getMiddlePoint };
