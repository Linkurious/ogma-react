# `@linkurious/react-ogma`

An adaptation of [`@linkurious/ogma`](https://ogma.linkurio.us) for React.

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

- `<Ogma />`
- Styles:
  - `<NodeStyle />`
  - `<EdgeStyle />`
- Overlays:
  - `<Popup />`
  - `<Tooltip />`
  - `<Layer />`
- Transformations:
  - `<NodeGrouping />`
  - `<EdgeGrouping />`
  - `<NeighbourGeneration />`
  - `<NeighbourMerging />`
  - `<NodeCollapsing />`

## Getting Started

Add Ogma to your project:

```
npm i @linkurious/ogma-react --save
```

You will need the CSS (see `web/src/styles.css`)

```tsx
import { Ogma, NodeStyle, Popup } from '@linkurious/ogma-react';
...
const onMouseMove = () => {}

<Ogma
  options={...}
  onReady={(ogma) => {
    ogma.events.on('click', ({ target }) => {
      console.log(target);
    });
  }}
>
  <NodeStyle attributes={{ color: 'red', radius: 10 }} />
  <PopUp
    position={() => clickedNode ? clickedNode.getPosition() : null}
  >
      <div>Popup content here!</div>
  </PopUp>
</Ogma>
```

## Documentation
