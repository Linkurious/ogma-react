import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import React from "react";
import { uuidv4 } from "./uuid";
import { withMap } from "./context";

export interface GeoJSONProps {
  id?: string;
  map: mapboxgl.Map;
  data:
    | GeoJSON.Feature<GeoJSON.Geometry>
    | GeoJSON.FeatureCollection<GeoJSON.Geometry>;
  layers: mapboxgl.AnyLayer[];
  onClick?: (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
  ) => void;
  onMouseEnter?: (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
  ) => void;
  onMouseLeave?: (
    e: mapboxgl.MapMouseEvent & {
      features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
    } & mapboxgl.EventData
  ) => void;
  onMouseMove?: (
    e: mapboxgl.MapMouseEvent & mapboxgl.EventData,
    features?: mapboxgl.MapboxGeoJSONFeature[] | undefined
  ) => void;
}

const GeoJSONComponent: React.FunctionComponent<GeoJSONProps> = ({
  id = uuidv4(),
  map,
  data,
  layers,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
}) => {
  // unmount hook
  React.useEffect(() => {
    layers.forEach((layer) => {
      if (onClick) {
        map.on("click", layer.id, onClick);
      }

      map.on("mouseenter", layer.id, (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (onMouseEnter) {
          onMouseEnter(e);
        }
      });

      map.on("mouseleave", layer.id, (e) => {
        map.getCanvas().style.cursor = "";
        if (onMouseLeave) {
          onMouseLeave(e);
        }
      });

      map.on("mousemove", layer.id, (e) => {
        map.getCanvas().style.cursor = "pointer";
        if (onMouseMove) {
          const features = map.queryRenderedFeatures(e.point);
          onMouseMove(e, features);
        }
      });
    });

    return () => {
      layers.forEach((layer) => {
        map.removeLayer(layer.id);
      });

      map.removeSource(id);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (map.getSource(id)) {
    (map.getSource(id) as GeoJSONSource).setData(data);
  } else {
    map.addSource(id, {
      type: "geojson",
      data,
    });
  }

  layers.forEach((layer) => {
    if (map.getLayer(layer.id)) {
      map.removeLayer(layer.id);
    }

    map.addLayer(layer);
  });

  return <>{children}</>;
};

export const GeoJSON = withMap<GeoJSONProps>(GeoJSONComponent);
