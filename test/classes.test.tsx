import React from "react";
import { render, act } from "@testing-library/react";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { StyleClass } from "../src/styles/classStyle";
import { Ogma } from "../src";
import graph from "./fixtures/simple_graph.json";

// Mock Ogma and its API
const mockDestroy = vi.fn();
const mockUpdate = vi.fn();
const mockCreateClass = vi.fn(() => ({
  update: mockUpdate,
  destroy: mockDestroy
}));
const mockGetClass = vi.fn(() => ({
  destroy: mockDestroy
}));
const mockOgma = {
  styles: {
    createClass: mockCreateClass,
    getClass: mockGetClass
  },
  view: {
    afterNextFrame: () => Promise.resolve()
  }
};

vi.mock("../src/context", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useOgma: () => mockOgma
  };
});

describe("StyleClass", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mounts and creates a style class", async () => {
    await act(async () => {
      render(
        <Ogma graph={graph}>
          <StyleClass
            name="test"
            edgeAttributes={{}}
            edgeOutput={{}}
            nodeAttributes={{}}
            nodeOutput={{}}
          />
        </Ogma>
      );
    });
    expect(mockCreateClass).toHaveBeenCalledWith(
      expect.objectContaining({ name: "test" })
    );
  });

  it("updates the style class when props change", async () => {
    const { rerender } = render(
      <Ogma graph={graph}>
        <StyleClass
          name="test"
          edgeAttributes={{ color: "red" }}
          edgeOutput={{}}
          nodeAttributes={{}}
          nodeOutput={{}}
        />
      </Ogma>
    );
    await act(async () => {
      rerender(
        <Ogma graph={graph}>
          <StyleClass
            name="test"
            edgeAttributes={{ a: 2 }}
            edgeOutput={{}}
            nodeAttributes={{}}
            nodeOutput={{}}
          />
        </Ogma>
      );
    });
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ edgeAttributes: { a: 2 } })
    );
  });

  it("cleans up on unmount", async () => {
    const { unmount } = render(
      <Ogma graph={graph}>
        <StyleClass
          name="test"
          edgeAttributes={{}}
          edgeOutput={{}}
          nodeAttributes={{}}
          nodeOutput={{}}
        />
      </Ogma>
    );
    await act(async () => {
      unmount();
    });
    expect(mockDestroy).toHaveBeenCalled();
  });
});
