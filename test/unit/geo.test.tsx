import { vi } from "vitest";
import { Geo as OgmaGeo } from "@linkurious/ogma/geo";
import { Ogma as OgmaLib } from "@linkurious/ogma";
import { Ogma, Geo, GeoMap } from "../../src";
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
        <GeoMap provider="mapbox" map={map} enabled onReady={onReady} />
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
        <GeoMap provider="maplibre" map={undefined} enabled onReady={onReady} />
      </Ogma>
    );
    expect(onReady).not.toHaveBeenCalled();
  });

  it("supports the legacy Ogma-owned geo mode API", async () => {
    const options = { latitudePath: "lat", longitudePath: "lng" };
    const enable = vi.fn(async () => {});
    const disable = vi.fn(async () => {});
    const onOgmaReady = (ogma: OgmaLib) => {
      vi.spyOn(ogma.geo, "enable").mockImplementation(enable);
      vi.spyOn(ogma.geo, "disable").mockImplementation(disable);
    };

    const { rerender } = render(
      <Ogma onReady={onOgmaReady}>
        <Geo {...options} enabled />
      </Ogma>
    );
    await waitFor(() => expect(enable).toHaveBeenCalledWith(options));

    rerender(
      <Ogma onReady={onOgmaReady}>
        <Geo {...options} />
      </Ogma>
    );
    await waitFor(() => expect(disable).toHaveBeenCalledWith());
  });
});
