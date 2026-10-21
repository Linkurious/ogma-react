import { useEffect, useRef, useState } from "react";
import {
  Geo as OgmaGeo,
  GeoOptions,
  ProviderAdapter,
  createDeckAdapter,
  createMapboxAdapter,
  createMaplibreAdapter
} from "@linkurious/ogma/geo";
import { useOgma } from "./context";

type MapboxMap = Parameters<typeof createMapboxAdapter>[0];
type MaplibreMap = Parameters<typeof createMaplibreAdapter>[0];
type DeckProvider = Parameters<typeof createDeckAdapter>[0];
// a real deck.gl `Deck` doesn't structurally match Ogma's DeckProvider type
// (protected members, differing `redraw` signature), so only require setProps
type DeckInstance = { setProps(props: any): void };

interface BaseGeoProps<ND, ED> extends GeoOptions<ND, ED> {
  /** On/off toggle */
  enabled?: boolean;
  /** Called once the geo binding is created */
  onReady?: (geo: OgmaGeo<ND, ED>) => void;
}

export type GeoProps<ND = unknown, ED = unknown> = BaseGeoProps<ND, ED> & {
  /** Library the `map` was created with */
  provider: "mapbox" | "maplibre" | "deck";
  /** Map (or deck.gl `Deck`) instance created by the user */
  map: MapboxMap | MaplibreMap | DeckInstance | null | undefined;
};

function createAdapter(
  provider: GeoProps["provider"],
  map: unknown
): ProviderAdapter {
  switch (provider) {
    case "mapbox":
      return createMapboxAdapter(map as MapboxMap);
    case "maplibre":
      return createMaplibreAdapter(map as MaplibreMap);
    case "deck":
      return createDeckAdapter(map as DeckProvider);
    default:
      throw new Error(`Unsupported geo provider: ${provider}`);
  }
}

/**
 * Geo mode component. The map (Mapbox GL, MapLibre GL or deck.gl) is created
 * and owned by the caller; this component only binds it to the Ogma instance.
 */
export function Geo<ND = unknown, ED = unknown>({
  enabled = false,
  map,
  provider,
  onReady,
  ...options
}: GeoProps<ND, ED>) {
  const ogma = useOgma<ND, ED>();
  const [geo, setGeo] = useState<OgmaGeo<ND, ED> | null>(null);
  // last pending enable/disable transition, so teardown never overlaps it
  const pending = useRef<Promise<unknown>>(Promise.resolve());

  // (re)create the binding whenever the map or the provider type changes
  useEffect(() => {
    if (!map) return;
    const instance = new OgmaGeo<ND, ED>(
      ogma,
      createAdapter(provider, map),
      options
    );
    setGeo(instance);
    onReady?.(instance);
    return () => {
      // disable first and swallow the error if Ogma was already destroyed
      const destroy = () =>
        instance
          .disable()
          .catch(() => {})
          .then(() => {
            if (!instance.enabled()) instance.destroy();
          });
      pending.current.then(destroy);
      setGeo(null);
    };
  }, [ogma, map, provider]);

  useEffect(() => {
    if (!geo) return;
    const run = pending.current.then(() =>
      enabled ? geo.enable() : geo.disable()
    );
    pending.current = run.catch(() => {});
  }, [geo, enabled]);

  // keep the options in sync after the binding is created
  useEffect(() => {
    if (geo) geo.setOptions(options);
  }, [
    geo,
    options.latitudePath,
    options.longitudePath,
    options.getCoordinates,
    options.projection,
    options.syncCamera,
    options.syncOnDrag,
    options.hideNodesWithoutCoordinates,
    options.reprojectOnViewChange,
    options.sizeRatio,
    options.minNodeSize
  ]);

  return null;
}
