import React from "react";
import mapboxgl, { MapboxOptions } from "mapbox-gl";
import { MapContext } from "./context";

export interface MapboxMapProps {
  token: string;
  mapboxOptions: Partial<MapboxOptions>;
  onStyleLoad?: (
    map: mapboxgl.Map,
    evt: mapboxgl.MapboxEvent<undefined> & mapboxgl.EventData
  ) => null;
  control?: string;
  scrollZoom?: boolean;
}

export const MapboxMap: React.FC<MapboxMapProps> = ({
  token,
  mapboxOptions,
  children,
  onStyleLoad,
  control,
  scrollZoom,
}) => {
  const [ready, setReady] = React.useState(false);
  const [map, setMap] = React.useState<mapboxgl.Map | undefined>();
  const [container, setContainer] = React.useState<HTMLDivElement | null>();

  React.useEffect(() => {
    if (container) {
      mapboxgl.accessToken = token;
      const map = new mapboxgl.Map({
        container,
        ...mapboxOptions,
      });

      if (control) {
        map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
      }

      if (scrollZoom === false) {
        map.scrollZoom.disable();
      }

      map.on("load", (evt) => {
        setReady(true);

        if (onStyleLoad) {
          onStyleLoad(map, evt);
        }
      });

      setMap(map);
    }
  }, [setMap, container]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MapContext.Provider value={map}>
      <div
        style={{ width: "100%", height: "100%" }}
        ref={(x) => setContainer(x)}
      >
        {ready && children}
      </div>
    </MapContext.Provider>
  );
};
