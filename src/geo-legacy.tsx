// Legacy geo mode (Ogma-owned map, via `ogma.geo`). Kept in a single file with
// no dependency on `@linkurious/ogma/geo` so it can be deleted in one go once
// the legacy API is dropped, and so the root entry point never pulls in code
// that needs Ogma >= 6.1.
import { useEffect } from "react";
import { GeoModeOptions } from "@linkurious/ogma";
import { useOgma } from "./context";

export interface GeoModeProps extends GeoModeOptions {
  /** On/off toggle */
  enabled?: boolean;
}

/**
 * Legacy geo mode component, where Ogma creates and owns the map (`ogma.geo`).
 *
 * @deprecated Import the new `Geo` from `@linkurious/ogma-react/geo`, which binds
 * a map you create yourself (MapLibre, Mapbox or deck.gl). Requires Ogma >= 6.1.
 */
export function Geo({ enabled = false, ...options }: GeoModeProps) {
  const ogma = useOgma();

  useEffect(() => {
    if (enabled) ogma.geo.enable(options);
    else ogma.geo.disable();
  }, [enabled]);

  return null;
}
