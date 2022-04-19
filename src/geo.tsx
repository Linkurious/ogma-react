import { useEffect } from "react";
import { GeoModeOptions } from "@linkurious/ogma";
import { useOgma } from "./context";

interface GeoModeProps extends GeoModeOptions {
  enabled?: boolean;
}

export function Geo({ enabled = false, ...options }: GeoModeProps) {
  const ogma = useOgma();

  useEffect(() => {
    if (enabled) ogma.geo.enable(options);
    else ogma.geo.disable();
  }, [enabled]);

  return null;
}
