import { useState } from "react";
import "./App.css";
import { PopUpContent } from "./PopupContent";
import { MapboxMap, GeoJSON, PopUp } from "../../";
import geojson from "./la.json";
import "mapbox-gl/dist/mapbox-gl.css";

interface propertiesProps {
  lnglat: mapboxgl.LngLat;
  name: string;
}

function App() {
  const [popUpProperty, setPopUpProperty] = useState<
    propertiesProps | undefined
  >();
  return (
    <div className="App">
      <h1>React Mapbox Light</h1>
      <div style={{ height: 500, width: 500, margin: "auto", marginTop: 50 }}>
        <MapboxMap
          token="pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2t1aTVtMWh0MHFlMzJvbm1vOGo2dTQzYSJ9.5sEf-pLMffICqD8spumntg"
          control="bottom-left"
          scrollZoom={false}
          mapboxOptions={{
            style: "mapbox://styles/mapbox/light-v10",
            center: [-2.2783131, 53.1400067],
            zoom: 5,
          }}
        >
          <GeoJSON
            data={geojson as any}
            id="ics"
            layers={[
              {
                id: "fillin",
                type: "fill",
                source: "ics",
                layout: {},
                paint: {
                  "fill-color": "#48AFF0",
                  "fill-opacity": 0.8,
                },
              },
              {
                id: "outline",
                type: "line",
                source: "ics",
                layout: {},
                paint: {
                  "line-color": "black",
                  "line-width": 2,
                },
              },
            ]}
            onMouseMove={(e, features) => {
              const rightLayer = features?.find(
                (row) => row.layer.id === "fillin"
              );

              if (rightLayer === undefined) {
                setPopUpProperty(undefined);
              }

              const property = {
                lnglat: e.lngLat,
                name: rightLayer?.properties?.rgn19nm,
                layer: rightLayer?.layer,
              };

              setPopUpProperty(property);
            }}
            onMouseLeave={(e) => setPopUpProperty(undefined)}
          />
          {popUpProperty && (
            <PopUp
              lnglat={popUpProperty.lnglat}
              closeButton={false}
              closeOnClick={false}
            >
              <PopUpContent area={popUpProperty.name} />
            </PopUp>
          )}
        </MapboxMap>
      </div>
    </div>
  );
}

export default App;
