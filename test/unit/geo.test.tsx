import { vi } from "vitest";
import { Geo as OgmaGeo, createMapboxAdapter } from "@linkurious/ogma/geo";
import * as ogmaGeo from "@linkurious/ogma/geo";
import { Ogma as OgmaLib } from "@linkurious/ogma";
import { Ogma, Geo as RootGeo } from "../../src";
import { Geo } from "../../src/geo";
import { render } from "./utils";
import { waitFor } from "@testing-library/react";

// The maplibre/deck adapters are replaced by the mapbox one (the fake map below
// has the shape it needs), so the tests only check which factory was dispatched to.
vi.mock("@linkurious/ogma/geo", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@linkurious/ogma/geo")>();
  return {
    ...actual,
    createMapboxAdapter: vi.fn(actual.createMapboxAdapter),
    createMaplibreAdapter: vi.fn(actual.createMapboxAdapter),
    createDeckAdapter: vi.fn(actual.createMapboxAdapter)
  };
});

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
    remove: vi.fn(),
    // deck.gl
    setProps: vi.fn()
  };
}
type FakeMap = ReturnType<typeof createFakeMap>;

describe("Geo (map-backed)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("binds the user-provided map and enables geo mode", async () => {
    const map = createFakeMap();
    const onReady = vi.fn();
    render(
      <Ogma>
        <Geo provider="mapbox" map={map as any} enabled onReady={onReady} />
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

  it.each([
    ["mapbox", ogmaGeo.createMapboxAdapter],
    ["maplibre", ogmaGeo.createMaplibreAdapter],
    ["deck", ogmaGeo.createDeckAdapter]
  ] as const)(
    "dispatches provider=%s to its adapter",
    async (provider, factory) => {
      const map = createFakeMap();
      const onReady = vi.fn();
      render(
        <Ogma>
          <Geo provider={provider} map={map as any} onReady={onReady} />
        </Ogma>
      );
      await waitFor(() => expect(onReady).toHaveBeenCalled());
      expect(factory).toHaveBeenCalledWith(map);
      for (const other of [
        ogmaGeo.createMapboxAdapter,
        ogmaGeo.createMaplibreAdapter,
        ogmaGeo.createDeckAdapter
      ])
        if (other !== factory) expect(other).not.toHaveBeenCalled();
      // sanity: the unmocked factory is still reachable
      expect(createMapboxAdapter).toBeDefined();
    }
  );

  it("tears down the old binding and creates a new one when the map changes", async () => {
    const mapA = createFakeMap();
    const mapB = createFakeMap();
    const onReady = vi.fn();
    const onDestroyed = vi.fn();
    const tree = (map: FakeMap) => (
      <Ogma>
        <Geo
          provider="mapbox"
          map={map as any}
          enabled
          onReady={onReady}
          onDestroyed={onDestroyed}
        />
      </Ogma>
    );
    const { rerender } = render(tree(mapA));
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    const first: OgmaGeo = onReady.mock.calls[0][0];
    await waitFor(() => expect(first.enabled()).toBe(true));
    const destroy = vi.spyOn(first, "destroy");

    rerender(tree(mapB));
    await waitFor(() => expect(onDestroyed).toHaveBeenCalledTimes(1));
    expect(destroy).toHaveBeenCalledTimes(1);
    expect(first.enabled()).toBe(false);

    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(2));
    const second: OgmaGeo = onReady.mock.calls[1][0];
    expect(second.getProvider()).toBe(mapB);
    await waitFor(() => expect(second.enabled()).toBe(true));
  });

  it("tears down and rebinds when the provider changes", async () => {
    const map = createFakeMap();
    const onReady = vi.fn();
    const onDestroyed = vi.fn();
    const { rerender } = render(
      <Ogma>
        <Geo
          provider="mapbox"
          map={map as any}
          onReady={onReady}
          onDestroyed={onDestroyed}
        />
      </Ogma>
    );
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(1));
    rerender(
      <Ogma>
        <Geo
          provider="maplibre"
          map={map as any}
          onReady={onReady}
          onDestroyed={onDestroyed}
        />
      </Ogma>
    );
    await waitFor(() => expect(onDestroyed).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(onReady).toHaveBeenCalledTimes(2));
    expect(ogmaGeo.createMaplibreAdapter).toHaveBeenCalledWith(map);
  });

  it("can be disabled and re-enabled", async () => {
    const map = createFakeMap();
    const onReady = vi.fn();
    const tree = (enabled: boolean) => (
      <Ogma>
        <Geo
          provider="mapbox"
          map={map as any}
          enabled={enabled}
          onReady={onReady}
        />
      </Ogma>
    );
    const { rerender } = render(tree(true));
    await waitFor(() => expect(onReady).toHaveBeenCalled());
    const geo: OgmaGeo = onReady.mock.calls[0][0];
    await waitFor(() => expect(geo.enabled()).toBe(true));

    rerender(tree(false));
    await waitFor(() => expect(geo.enabled()).toBe(false));

    rerender(tree(true));
    await waitFor(() => expect(geo.enabled()).toBe(true));
    // same binding all along
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it("syncs changed options through setOptions", async () => {
    const map = createFakeMap();
    const onReady = vi.fn();
    const tree = (sizeRatio: number) => (
      <Ogma>
        <Geo
          provider="mapbox"
          map={map as any}
          sizeRatio={sizeRatio}
          onReady={onReady}
        />
      </Ogma>
    );
    const { rerender } = render(tree(1));
    await waitFor(() => expect(onReady).toHaveBeenCalled());
    const geo: OgmaGeo = onReady.mock.calls[0][0];
    const setOptions = vi.spyOn(geo, "setOptions");

    // unchanged options: nothing to sync
    rerender(tree(1));
    expect(setOptions).not.toHaveBeenCalled();

    rerender(tree(2));
    await waitFor(() =>
      expect(setOptions).toHaveBeenCalledWith(
        expect.objectContaining({ sizeRatio: 2 })
      )
    );
  });
});

describe("Geo (legacy)", () => {
  // NB: the legacy Leaflet-backed map is no longer exercised in the demo or e2e
  // tests; only the calls made to `ogma.geo` are checked here.
  const options = { latitudePath: "lat", longitudePath: "lng" };

  async function checkLegacy(Component: typeof Geo | typeof RootGeo) {
    const enable = vi.fn(async () => {});
    const disable = vi.fn(async () => {});
    const onOgmaReady = (ogma: OgmaLib) => {
      vi.spyOn(ogma.geo, "enable").mockImplementation(enable);
      vi.spyOn(ogma.geo, "disable").mockImplementation(disable);
    };

    const { rerender } = render(
      <Ogma onReady={onOgmaReady}>
        <Component {...options} enabled />
      </Ogma>
    );
    await waitFor(() => expect(enable).toHaveBeenCalledWith(options));

    rerender(
      <Ogma onReady={onOgmaReady}>
        <Component {...options} />
      </Ogma>
    );
    await waitFor(() => expect(disable).toHaveBeenCalledWith());
  }

  it("root <Geo> keeps the Ogma-owned geo mode API", () =>
    checkLegacy(RootGeo));

  it("<Geo> without a provider selects the legacy path", () =>
    checkLegacy(Geo));

  it("<Geo> with a provider does not touch ogma.geo", async () => {
    const map = createFakeMap();
    const onReady = vi.fn();
    const enable = vi.fn(async () => {});
    render(
      <Ogma
        onReady={(ogma) => {
          vi.spyOn(ogma.geo, "enable").mockImplementation(enable);
        }}
      >
        <Geo provider="mapbox" map={map as any} enabled onReady={onReady} />
      </Ogma>
    );
    await waitFor(() => expect(onReady).toHaveBeenCalled());
    const geo: OgmaGeo = onReady.mock.calls[0][0];
    await waitFor(() => expect(geo.enabled()).toBe(true));
    expect(enable).not.toHaveBeenCalled();
  });
});
