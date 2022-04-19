# `@linkurious/react-ogma`

An wrapper of [`@linkurious/ogma`](https://ogma.linkurio.us) for use with [React](https://reactjs.org).

  * [Getting started](#getting-started)
  * [Usage](#usage)
  * [API](#api)
    - [`<Ogma />`](#ogma-)
    - Styles:
      - [`<NodeStyle />`](#nodestyle-)
      - [`<EdgeStyle />`](#edgestyle-)
    - Overlays:
      - [`<Popup />`](#popup-)
      - [`<Tooltip />`](#tooltip-)
      - [`<CanvasLayer />`](#canvaslayer-)
    - Transformations:
      - [`<NodeGrouping />`](#nodegrouping-)
      - [`<EdgeGrouping />`](#edgegrouping-)
      - [`<NeighborGeneration />`](#neighborgeneration-)
      - [`<NeighborMerging />`](#neighbormerging-)
      - [`<NodeCollapsing />`](#nodecollapsing-)
    - [`<Geo />`](#geo-)

## Getting Started

Add `@linkurious/ogma` and `@linkurious/ogma-react` to your project. For Ogma, you should use you NPM link from [get.linkuri.us](https://get.linkurio.us).

```bash
npm install <YOUR_LINK_WITH_API_KEY>
npm i @linkurious/ogma-react --save
```

Or, with yarn:

```
yanpm i <YOUR_LINK_WITH_API_KEY>
yarn add @linkurious/ogma-react
```

You will need the CSS or Styled Components (see `web/src/styles.css` for an example). No CSS is included by default.

```tsx
import { Ogma, NodeStyle, Popup } from '@linkurious/ogma-react';
import { MouseButtonEvent, Node as OgmaNode } from '@linkurious/ogma';
...
const [clickedNode, setClickedNode] = useState<OgmaNode|null>(null);
const onMouseMove = ({ target }: MouseButtonEvent) => {
  setClickedNode((target && target.isNode) ? target : null);
}

<Ogma
  options={...}
  onReady={(ogma) => {
    ogma.events.on('click', onClick);
  }}
>
  <NodeStyle attributes={{ color: 'red', radius: 10 }} />
  <Popup
    position={() => clickedNode ? clickedNode.getPosition() : null}
  >
      <div>Popup content here!</div>
  </Popup>
</Ogma>
```


## Usage

See the [`web/src/App.tsx`](https://github.com/Linkurious/ogma-react/blob/develop/web/src/App.tsx) file for a complete example.

```tsx
const graph: Ogma.RawGraph = ...;
return <Ogma options={{ backgroundColor: '#9dc5bb'}} graph={graph}>
```

### Custom components

You can (and should) create your own components to implement different behaviors. It's easy, you just need to use the `useOgma` hook to get access to the instance of Ogma.

```tsx
import { useOgma } from '@linkurious/ogma-react';

export function MyComponent() {
  const ogma = useOgma();
  const onClick = useCallback(() => {
    ogma.getNodes([1,2,3,4]).setSelected(true);
  }, []);

  return (
    <div>
      <button onClick={onClick}>Select nodes 1, 2, 3, 4</button>
    </div>
  );
}
```

### How to apply the layouts

It's unintuitive to implement the layouts as a React component declaratively. We suggest using custom components and hook to ogma events to apply the layouts.

`components/LayoutService.tsx`:

  ```tsx
  import { useEffect } from 'react';
  import { useOgma } from '@linkurious/react-ogma';
  export function LayoutService () {
    const ogma = useOgma(); // hook to get the ogma instance

    useEffect(() => {
      const onNodesAdded = () => {
        // apply your layout
      }
      ogma.events.on('addNodes', onNodesAdded);

      // cleanup
      return () => {
        ogma.events.off(onNodesAdded);
      });
    }, []);

    return null;
  }
  ```


`App.tsx`:
```tsx
import { LayoutService } from './components/LayoutService';

export default function App() {
  ... // retrive the graph here

  return (<Ogma options={options} graph={graph}>
    <LayoutService />
  </Ogma>);
}
```

### How to load the graph

```tsx
import { useState, useEffect } from 'react';
import { RawGraph } from '@linkurious/ogma';

export default function App () {
  const [isLoading, setIsLoading] = useState(true);
  const [graph, setGraph] = useState<RawGraph>();

  useEffect(() => {
    fetch('/graph.json')
      .then(res => res.json())
      .then(json => {
        setGraph(json);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return (<div>Loading...</div>);
  return (<Ogma graph={graph}/>);
}
```
Using the parsers:

```tsx
import { useState, useEffect } from 'react';
import Ogma, { RawGraph } from '@linkurious/ogma';

export default function App () {
  const [isLoading, setIsLoading] = useState(true);
  const [graph, setGraph] = useState<RawGraph>();

  // using ogma parser to parse GEXF format
  useEffect(() => {
    fetch('/graph.gexf')
      .then(res => res.text())
      .then(gexf => Ogma.parse.gexf(gexf))
      .then(jsonGraph => {
        setGraph(jsonGraph);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return (<div>Loading...</div>);

  return (<Ogma graph={graph} />)
}
```

## Components

- [`<Ogma />`](#ogma-)
- Styles:
  - [`<NodeStyle />`](#nodestyle-)
  - [`<EdgeStyle />`](#edgestyle-)
- Overlays:
  - [`<Popup />`](#popup-)
  - [`<Tooltip />`](#tooltip-)
  - [`<CanvasLayer />`](#canvaslayer-)
- Transformations:
  - [`<NodeGrouping />`](#nodegrouping-)
  - [`<EdgeGrouping />`](#edgegrouping-)
  - [`<NeighborGeneration />`](#neighborgeneration-)
  - [`<NeighborMerging />`](#neighbormerging-)
  - [`<NodeCollapsing />`](#nodecollapsing-)
- [`<Geo />`](#geo-)

## API

### `<Ogma />`

Main visualisation component. You can use `onReady` or `ref` prop to get a reference to the Ogma instance.

#### Props

| Prop       | Type                   | Default | Description |
| ---------- | ---------------------- | ------- | ----------- |
| `options?` | `Ogma.Options`         | `{}`    | Ogma options                                                                                                                                                            |
| `graph?`   | `Ogma.RawGraph`        | `null`  | The graph to render                                                                                                                                                     |
| `onReady?` | `(ogma: Ogma) => void` | `null`  | Callback when the Ogma instance is ready                                                                                                                                |
| `ref?`     | `React.Ref<Ogma>`      | `null`  | Reference to the Ogma instance                                                                                                                                          |
| `children` | `React.ReactNode`      | `null`  | The children of the component, such as `<Popup>` or `<Tooltip>` or your custom component. Ogma instance is avalable to the children components through `useOgma()` hook |

### `<NodeStyle />`

Node style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | `Ogma.NodeAttributeValue`      | `{}`    | Attributes to apply to the node              |
| `selector?`  | `(node: Ogma.Node) => boolean` | `null`  | Selector to apply the attributes to the node |
| `ref?`       | `React.Ref<Ogma.StyleRule>`    | `null`  | Reference to the style rule                  |

#### Example

```tsx
<Ogma>
  <NodeStyle attributes={{ color: "red", radius: 10 }} />
</Ogma>
```

### `<EdgeStyle />`

Edge style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | `Ogma.EdgeAttributeValue`      | `{}`    | Attributes to apply to the edge              |
| `selector?`  | `(edge: Ogma.Edge) => boolean` | `null`  | Selector to apply the attributes to the edge |
| `ref?`       | `React.Ref<Ogma.StyleRule>`    | `null`  | Reference to the style rule                  |

#### Example

```tsx
<Ogma>
  <EdgeStyle attributes={{ color: "red" }} />
</Ogma>
```

### `<Popup />`

Custom popup UI layer.

#### Props

| Prop               | Type               | Default                 | Description                                                  |
| ------------------ | ------------------ | ----------------------- | ----------------------------------------------------------- |
| `position`         | `Point \| (ogma: Ogma) => Point`  | `null`                                                       | Position of the popup               |
| `size?`            | `{ width: number \| 'auto'; height: number \| 'auto'; }`                                                   | `{ width: 'auto', height: 'auto' }` | Size of the popup      |
| `children`         | `React.ReactNode`  | `null`                  | The children of the component                                |
| `isOpen`           | `boolean`          | `true`                  | Whether the popup is open                                    |
| `onClose`          | `() => void`       | `null`                  | Callback when the popup is closed                            |
| `placement`        | `'top' \| 'bottom' \| 'right'\| 'left'` | Placement of the popup |
| `ref?`             | `React.Ref<Popup>` | `null`                  | Reference to the popup                                       |
| `closeOnEsc?`      | `boolean`          | `true`                  | Whether to close the popup when the user presses the ESC key |
| `popupClass?`      | `string`           | `'ogma-popup'`          | Class name to apply to the popup container                   |
| `contentClass?`    | `string`           | `'ogma-popup--content'` | Class name to apply to the popup content                     |
| `popupBodyClass?`  | `string`           | `'ogma-popup--body'`    | Class name to apply to the popup body                        |
| `closePopupClass?` | `string`           | `'ogma-popup--close'`   | Class name to apply to the close button                      |

#### Example

```tsx
<Ogma>
  <Popup
    position={() => (clickedNode ? clickedNode.getPosition() : null)}
    size={{ width: 200, height: 200 }}
  >
    <div>Popup content here!</div>
  </Popup>
</Ogma>
```

### `<Tooltip />`

Tooltip component. Use it for cutom movable tooltips. It automatically adjusts the placement of the tooltip to conainer bounds.

#### Props

| Prop        | Type              | Default                | Description                   |
| ----------- | ----------------- | ---------------------- | ----------------------------- |
| `position`  | `Point \| (ogma: Ogma) => Point` |  | Position of the tooltip             |
| `size?`     | `{ width: number  \| 'auto'; height: number \| 'auto'; }` | `{ width: 'auto', height: 'auto' }` | Size of the tooltip |
| `children`  | `React.ReactNode` | `null`                 | The children of the component |
| `visible`   | `boolean`         | `true`                 | Whether the tooltip is open   |
| `placement` | `Placement`       | `right`                | Placement of the tooltip      |
| `ref?`      | `React.Ref<Tooltip>` | `null`              | Reference to the tooltip      |
| `tooltipClass` | `string`        | `'ogma-tooltip'`      | Class name to apply to the tooltip container |

#### Example

```tsx
<Ogma>
  <Tooltip
    visible={hoveredNode}
    position={() => (hoveredNode ? hoveredNode.getPosition() : null)}
    size={{ width: 200, height: 200 }}
  >
    <div>Tooltip content here!</div>
  </Tooltip>
</Ogma>
```

### `<CanvasLayer />`

Custom canvas layer.

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `ref` | `React.Ref<CanvasLayer>` | `null` | Reference to the canvas layer |
| `render` | `(ctx: CanvasRenderingContext2D) => void` | `null` | Callback to render the canvas layer |
| `index?` | `number` | `1` | Index of the layer |
| `isStatic?` | `boolean` | `false` | Whether the layer is static |
| `noClear?` | `boolean` | `false` | Whether to clear the canvas before rendering |

#### Example

```tsx
<Ogma>
  <CanvasLayer
    render={(ctx) => {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 100, 100);
    }}
  />
</Ogma>
```

### `<NodeGrouping />`

Node grouping transformation. See [`ogma.transformations.addNodeGrouping()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeGrouping) for more details.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector`   | `(node: Ogma.Node) => boolean` | `null`  | Selector to apply the attributes to the node |
| `groupIdFunction` | `(node: Ogma.Node) => string \| undefined`      |     | Grouping function              |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addNodeGrouping()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeGrouping) properties | | Node grouping transformation properties |

#### Example

```tsx
<Ogma graph={...}>
  <NodeGrouping
    selector={node => node.getAttribute('type') === 'type1'}
    groupIdFunction={node => node.getAttribute('type')}
    disabled={false}
  />
</Ogma>
```

### `<EdgeGrouping />`

Edge grouping transformation. See [`ogma.transformations.addEdgeGrouping()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeGrouping) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector`   | `(edge: Ogma.Edge) => boolean` | `null`  | Selector for the edges |
| `groupIdFunction` | `(edge: Ogma.Edge) => string \| undefined`      |     | Grouping function              |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addEdgeGrouping()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeGrouping) properties | | Edge grouping transformation properties |


#### Example

```tsx
<Ogma graph={...}>
  <EdgeGrouping
    selector={edge => edge.getAttribute('type') === 'type1'}
    groupIdFunction={edge => edge.getAttribute('type')}
    disabled={false}
  />
</Ogma>
```

### `<NeighborMerging />`

Neighbor merging transformation. See [`ogma.transformations.addNeighborMerging()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNeighborMerging) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector`   | `(node: Ogma.Node) => boolean` | `null`  | Selector |
| `dataFunction` | `(node: Ogma.Node) => object | undefined;`      |     | Neighbor data function              |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addNeighborMerging()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNeighborMerging) properties | | Neighbor merging transformation properties |

#### Example

```tsx
<Ogma graph={...}>
  <NeighborMerging
    selector={node => node.getAttribute('type') === 'type1'}
    dataFunction={node => ({
      type: node.getAttribute('type'),
      label: node.getAttribute('label'),
    })}
    disabled={false}
  />
</Ogma>
```

### `<NeighborGeneration />`

Neighbor generation transformation. See [`ogma.transformations.addNeighborGeneration()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNeighborGeneration) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector`   | `(node: Ogma.Node) => boolean` | `null`  | Selector |
| `neighborIdFunction` | `(node: Ogma.Node) => string|Array<string>|null;`      |     | Neighbor data function              |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addNeighborMerging()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNeighborGeneration) properties | | Transformation properties |

#### Example

```tsx
<Ogma graph={...}>
  <NeighborGeneration
    selector={node => node.getAttribute('type') === 'type1'}
    neighborIdFunction={node => node.getAttribute('type')}
    disabled={false}
  />
</Ogma>
```

### `<NodeCollapsing />`

Node collapsing transformation. See [`ogma.transformations.addNodeCollapsing()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeCollapsing) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector`   | `(node: Ogma.Node) => boolean` | `null`  | Selector |
| `edgeGenerator?` | `(hiddenNode: Ogma.Node, node1: Ogma.Node, node2: Ogma.Node, edges1: Ogma.EdgeList, edges2: Ogma.EdgeList): RawEdge|null)` |     | Edge generator function              |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addNodeCollapsing()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeCollapsing) properties | | Transformation properties |


### `<Geo />`

Geo mode component. It's the first version of this component and we are still gathering feedback on how you can use it.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `enabled?`       | `boolean`    | `false`  | On/off toggle |
| `...rest` | `Ogma.GeomModeOptions`  | | See [`GeoModeOptions`](https://doc.linkurio.us/ogma/latest/api.html#GeoModeOptions) properties |


## License

Apache 2.0


