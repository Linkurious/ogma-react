import { useRef } from "react";
import { Map as MapboxReactMap } from "@vis.gl/react-mapbox";
import { Map as MaplibreReactMap } from "@vis.gl/react-maplibre";
import DeckGL, { type DeckGLRef } from "@deck.gl/react";
import type { Deck } from "@deck.gl/core";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import type { Map as MapboxMap } from "mapbox-gl";
import * as maplibregl from "maplibre-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "maplibre-gl/dist/maplibre-gl.css";
// let vite bundle the worker and tell maplibre where to find it
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";

maplibregl.setWorkerUrl(maplibreWorkerUrl);

export type GeoProvider = "maplibre" | "mapbox" | "deck";
export type GeoMap = maplibregl.Map | MapboxMap | Deck;

// public token (pk.…) in a .env.local file: VITE_MAPBOX_TOKEN=pk.xxx
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as
  | string
  | undefined;

const initialViewState = { longitude: -100, latitude: 40, zoom: 3 };
const fill = { position: "absolute", inset: "0" } as const;

const osmLayer = new TileLayer({
  id: "osm",
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
  /** Called with the map instance once it is ready to be bound to Ogma */
  onMap: (map: GeoMap) => void;
}

/**
 * Creates and owns the map for the chosen provider. <Geo /> only binds it.
 */
export function GeoBasemap({ provider, onMap }: GeoBasemapProps) {
  const deckRef = useRef<DeckGLRef>(null);

  switch (provider) {
    case "maplibre":
      return (
        <MaplibreReactMap
          style={fill}
          initialViewState={initialViewState}
          mapStyle="https://demotiles.maplibre.org/style.json"
          onLoad={(e) => onMap(e.target)}
        />
      );
    case "mapbox":
      return (
        <MapboxReactMap
          style={fill}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={initialViewState}
          mapStyle="mapbox://styles/mapbox/light-v11"
          onLoad={(e) => onMap(e.target)}
        />
      );
    case "deck":
      return (
        <DeckGL
          ref={deckRef}
          style={fill}
          initialViewState={initialViewState}
          controller
          layers={[osmLayer]}
          onLoad={() => deckRef.current?.deck && onMap(deckRef.current.deck)}
        />
      );
  }
}
