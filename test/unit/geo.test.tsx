import { vi } from "vitest";
import { Geo as OgmaGeo } from "@linkurious/ogma/geo";
import { Ogma, Geo } from "../../src";
import { render } from "./utils";
import { waitFor } from "@testing-library/react";

// minimal stand-in for a mapbox/maplibre map owned by the user
function createFakeMap() {
  const container = document.createElement("div");
  const listeners: Record<string, Array<(ev?: unknown) => void>> = {};
  return {
    getCenter: () => ({ lng: 0, lat: 0 }),
    getZoom: () => 1,
    getBearing: () => 0,
    project: ([x, y]: [number, number]) => ({ x, y }),
    unproject: ([x, y]: [number, number]) => ({ lng: x, lat: y }),
    jumpTo: vi.fn(),
    getContainer: () => container,
    getCanvasContainer: () => container,
    getCanvas: () => document.createElement("canvas"),
    on: (type: string, fn: (ev?: unknown) => void) =>
      (listeners[type] ??= []).push(fn),
    off: vi.fn(),
    remove: vi.fn()
  };
}

describe("Geo Mode", () => {
  it("binds the user-provided map and enables geo mode", async () => {
    const map = createFakeMap();
    const onReady = vi.fn();
    render(
      <Ogma>
        <Geo provider="mapbox" map={map} enabled onReady={onReady} />
      </Ogma>
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const geo: OgmaGeo = onReady.mock.calls[0][0];
    await waitFor(() => expect(geo.enabled()).toBe(true));
    expect(geo.getProvider()).toBe(map);
  });

  it("does nothing until a map is provided", () => {
    const onReady = vi.fn();
    render(
      <Ogma>
        <Geo provider="maplibre" map={undefined} enabled onReady={onReady} />
      </Ogma>
    );
    expect(onReady).not.toHaveBeenCalled();
  });
});
