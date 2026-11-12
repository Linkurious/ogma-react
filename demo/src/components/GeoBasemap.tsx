import { useEffect, useRef } from "react";
import { Deck } from "@deck.gl/core";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import mapboxgl from "mapbox-gl";
import * as maplibregl from "maplibre-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "maplibre-gl/dist/maplibre-gl.css";
// let vite bundle the worker and tell maplibre where to find it
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import type { GeoProvider } from "../../../src/geo";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

export type MapInstance = maplibregl.Map | mapboxgl.Map | Deck;

// public token (pk.…) in a .env.local file: VITE_MAPBOX_TOKEN=pk.xxx
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as
  | string
  | undefined;

/** Vector tiles, styled client-side by MapLibre. */
export const MAPLIBRE_STYLE = "https://demotiles.maplibre.org/style.json";

const view = { longitude: -100, latitude: 40, zoom: 3 };

/** deck.gl has no basemap of its own: raster OpenStreetMap tiles (not vector). */
const osmRasterLayer = () =>
  new TileLayer({
    id: "osm-raster",
    data: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    tileSize: 256,
    maxZoom: 19,
    renderSubLayers: (props) => {
      const { west, south, east, north } = props.tile.bbox as {
        west: number;
        south: number;
        east: number;
        north: number;
      };
      return new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [west, south, east, north]
      });
    }
  });

interface GeoBasemapProps {
  provider: GeoProvider;
  hidden: boolean;
  /** Called with the map once it is ready to be bound to Ogma */
  onMap: (provider: GeoProvider, map: MapInstance) => void;
}

/**
 * Creates and owns one plain map instance. It stays mounted (just hidden) when
 * another provider is selected, so the map never disappears while Ogma's geo
 * binding is still shutting down.
 */
export function GeoBasemap({ provider, hidden, onMap }: GeoBasemapProps) {
  const container = useRef<HTMLDivElement>(null);
  const onMapRef = useRef(onMap);
  onMapRef.current = onMap;

  useEffect(() => {
    const parent = container.current!;
    const ready = (map: MapInstance) => onMapRef.current(provider, map);

    switch (provider) {
      case "maplibre": {
        const map = new maplibregl.Map({
          container: parent,
          style: MAPLIBRE_STYLE,
          center: [view.longitude, view.latitude],
          zoom: view.zoom
        });
        map.on("load", () => ready(map));
        return () => map.remove();
      }
      case "mapbox": {
        const map = new mapboxgl.Map({
          container: parent,
          accessToken: MAPBOX_TOKEN,
          style: "mapbox://styles/mapbox/light-v11",
          center: [view.longitude, view.latitude],
          zoom: view.zoom
        });
        map.on("load", () => ready(map));
        return () => map.remove();
      }
      case "deck": {
        const deck: Deck = new Deck({
          parent,
          initialViewState: view,
          controller: true,
          layers: [osmRasterLayer()],
          onLoad: () => ready(deck)
        });
        return () => deck.finalize();
      }
    }
  }, [provider]);

  // The map gets its own inner element: MapLibre/Mapbox set `position: relative`
  // on their container, which would override the absolute positioning of the wrapper.
  return (
    <div className="geo-basemap" hidden={hidden}>
      <div
        ref={container}
        style={{ position: "relative", width: "100%", height: "100%" }}
      />
    </div>
  );
}
