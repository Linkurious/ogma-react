# react-mapbox-light

A modern and light adaptation of `mapbox-gl` for React.

## Design

```tsx
const graph: Ogma.RawGraph = ...;
<Ogma options={options} graph={graph}>
  <Transformations.NodeGrouping options={} />
  <Layer />
  <CanvasLayer />
</Ogma>
```

## Components

- MapboxMap
- GeoJSON
- PopUp

## Getting Started

```
npm i @carnallfarrar/react-mapbox-light mapbox-gl --save
```

You will need to add mapbox CSS by importing it into your JS/TS files or inject it into your HTML

```
import "mapbox-gl/dist/mapbox-gl.css";
```

```html
<html>
  <head>
    ...
    <link
      href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
      rel="stylesheet"
    />
  </head>
</html>
```

```tsx
import { MapboxMap, GeoJSON, PopUp } from 'react-mapbox-light';
...

      <MapboxMap
        token={process.env.REACT_APP_MAPBOX_TOKEN!}
        control="bottom-left"
        scrollZoom={false}
        mapboxOptions={{
          style: "mapbox://styles/mapbox/light-v10",
          center: [-2.2783131, 53.1400067],
          zoom: 6,
        }}
      >
        <GeoJSON
            data={geojson}
            id="outline-layer"
            layers={[
                {
                id: "outline",
                type: "line",
                source: "outline-layer",
                layout: {},
                paint: {
                    "line-color": "#fff",
                    "line-width": 2,
                },
                },
            ]}
            onMouseMove={(e, features) => handleMouseMove(e, features)}
        />
        <PopUp
            lnglat={popUpProperty?.lnglat}
            closeButton={false}
            closeOnClick={true}
        >
            <div>Popup content here!</div>
        </PopUp>
      </MapboxMap>
```

## Documentation

### MapboxMap

This is the main component used to render a Mapbox map into the DOM.

#### Properties

| Property      | type     | Required | Description                                                                                        |
| ------------- | -------- | -------- | -------------------------------------------------------------------------------------------------- |
| token         | string   | Yes      | Mapbox GL token to use for the map                                                                 |
| control       | string   | No       | No control is diplayed if not provided, if provided value should be the position of the control.   |
| scrollZoom    | boolean  | No       | default to True. if provided with false it will disable zoom on scroll                             |
| mapboxOptions | object   | No       | Mapbox options to pass to the map, see [mapbox doc](https://docs.mapbox.com/mapbox-gl-js/api/map/) |
| onStyleLoad   | Function | No       | a callback function called when the map style has loaded                                           |

### GeoJSON

a GeoJSON component instantiating a source and multiple layer for a given geojson.

#### Properties

| Property     | type     | Required | Description                                                                                                |
| ------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| data         | Object   | Yes      | The data for the GeoJSON to display                                                                        |
| id           | string   | No       | The ID to use to display the source provided as data                                                       |
| layers       | Array    | Yes      | [Mapbox layer(s)](https://docs.mapbox.com/help/glossary/layer/) to use to display GeoJSON provided as data |
| onClick      | Function | No       | onClick event provided to all layers displayed                                                             |
| onMouseEnter | Function | No       | onMouseEnter event provided to all layers displayed                                                        |
| onMouseLeave | Function | No       | onMouseLeave event provided to all layers displayed                                                        |

### PopUp

using the mapboxgl inbuilt popup functionality
you can include a React component or plain HTML as a child component to populate the popup content

#### Properties

| Property     | type            | Required | Description                                        |
| ------------ | --------------- | -------- | -------------------------------------------------- |
| latlng       | mapboxgl.LngLat | Yes      | The lat and long coordinates of the mouse position |
| closeButton  | Boolean         | Yes      | Add a close button to the popup                    |
| closeOnClick | Boolean         | Yes      | Close the popup on click anywhere in the map       |
