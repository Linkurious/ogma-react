// Entry point: `@linkurious/ogma-react/geo`.
// Statically imports `@linkurious/ogma/geo` (Ogma >= 6.1), so it must NOT be
// imported from the root entry point (src/index.ts) until the peer range is raised.
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
import { Geo as LegacyGeo, GeoModeProps } from "./geo-legacy";

export type { GeoModeProps };

type MapboxMap = Parameters<typeof createMapboxAdapter>[0];
type MaplibreMap = Parameters<typeof createMaplibreAdapter>[0];
type DeckProvider = Parameters<typeof createDeckAdapter>[0];
// A real deck.gl `Deck` doesn't structurally match Ogma's DeckProvider type
// (protected members, differing `redraw` signature), so only require setProps.
// TODO: report upstream to Ogma and link the issue here.
type DeckInstance = { setProps(props: any): void };

/** `provider` and `map` are linked: the map must come from the matching library. */
export type GeoMapSource =
  | { provider: "mapbox"; map: MapboxMap | null | undefined }
  | { provider: "maplibre"; map: MaplibreMap | null | undefined }
  | { provider: "deck"; map: DeckInstance | null | undefined };

export type GeoProvider = GeoMapSource["provider"];

interface BaseGeoProps<ND, ED> extends GeoOptions<ND, ED> {
  /** On/off toggle */
  enabled?: boolean;
  /** Called once the geo binding is created */
  onReady?: (geo: OgmaGeo<ND, ED>) => void;
  /** Called once the binding has been fully disabled and destroyed */
  onDestroyed?: () => void;
}

/** Map-backed geo mode: the map is created and owned by the caller. */
export type MapGeoProps<ND = unknown, ED = unknown> = BaseGeoProps<ND, ED> &
  GeoMapSource;

/** Legacy geo mode (Ogma-owned map). `provider` must be absent. */
export type LegacyGeoProps = GeoModeProps & { provider?: undefined };

export type GeoProps<ND = unknown, ED = unknown> =
  | LegacyGeoProps
  | MapGeoProps<ND, ED>;

function createAdapter({ provider, map }: GeoMapSource): ProviderAdapter {
  switch (provider) {
    case "mapbox":
      return createMapboxAdapter(map!);
    case "maplibre":
      return createMaplibreAdapter(map!);
    case "deck":
      return createDeckAdapter(map as DeckProvider);
    default:
      throw new Error(`Unsupported geo provider: ${provider}`);
  }
}

function shallowEqual(a: object, b: object) {
  const ka = Object.keys(a) as (keyof typeof a)[];
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => Object.is(a[k], b[k]));
}

/** Returns the previous object while it stays shallow-equal to the new one. */
function useShallowStable<T extends object>(value: T): T {
  const ref = useRef(value);
  if (!shallowEqual(ref.current, value)) ref.current = value;
  return ref.current;
}

/**
 * Binds a caller-created map (MapLibre GL, Mapbox GL or deck.gl) to Ogma.
 * Only uses `new Geo(ogma, adapter, options)`, never `ogma.geo`.
 */
function MapGeo<ND, ED>({
  enabled = false,
  provider,
  map,
  onReady,
  onDestroyed,
  ...rest
}: MapGeoProps<ND, ED>) {
  const ogma = useOgma<ND, ED>();
  const [geo, setGeo] = useState<OgmaGeo<ND, ED> | null>(null);
  const options = useShallowStable(rest as GeoOptions<ND, ED>);
  const latest = useRef({ options, onReady, onDestroyed });
  latest.current = { options, onReady, onDestroyed };
  // Options the binding was created with, so we don't re-apply them right away.
  const applied = useRef<GeoOptions<ND, ED>>(options);

  // Ogma's enable()/disable() are async, and `new Geo()` throws while another
  // binding still holds the Ogma instance (its position layer is only released
  // by destroy()). So every transition (create, enable, disable, teardown) runs
  // on one queue: a replacement binding is only built once the old one is gone.
  // Errors are swallowed: they are expected when Ogma was destroyed first.
  const queue = useRef<Promise<void>>(Promise.resolve());
  const schedule = (task: () => unknown) => {
    queue.current = queue.current.then(task).then(undefined, () => {});
  };
  // binding owned by this component; cleared on teardown so that a transition
  // queued in the same commit for the old binding is skipped
  const owned = useRef<OgmaGeo<ND, ED> | null>(null);

  // (re)create the binding whenever the map or the provider changes
  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    let instance: OgmaGeo<ND, ED> | undefined;
    schedule(() => {
      if (cancelled) return;
      instance = new OgmaGeo<ND, ED>(
        ogma,
        createAdapter({ provider, map } as GeoMapSource),
        latest.current.options
      );
      applied.current = latest.current.options;
      owned.current = instance;
      setGeo(instance);
      latest.current.onReady?.(instance);
    });
    return () => {
      cancelled = true;
      owned.current = null;
      setGeo(null);
      schedule(async () => {
        if (!instance) return;
        try {
          await instance.disable();
          instance.destroy();
        } finally {
          latest.current.onDestroyed?.();
        }
      });
    };
  }, [ogma, map, provider]);

  useEffect(() => {
    if (!geo) return;
    schedule(() => {
      if (owned.current !== geo) return;
      return enabled ? geo.enable() : geo.disable();
    });
  }, [geo, enabled]);

  // sync every option, current and future, after the binding is created
  useEffect(() => {
    if (geo && applied.current !== options) {
      applied.current = options;
      geo.setOptions(options);
    }
  }, [geo, options]);

  return null;
}

/**
 * Geo mode. With a `provider` (and the `map` you created) it binds that map to
 * Ogma; without one it falls back to the legacy Ogma-owned map behavior.
 *
 * Discriminates on `provider`, not `map`: `map` is undefined while the basemap loads.
 */
export function Geo<ND = unknown, ED = unknown>(props: GeoProps<ND, ED>) {
  return props.provider === undefined ? (
    <LegacyGeo {...props} />
  ) : (
    <MapGeo<ND, ED> {...props} />
  );
}

export type { GeoOptions, OgmaGeo };
