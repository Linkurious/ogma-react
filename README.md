# `@linkurious/ogma-react`

![logo](/demo/logo.svg)

Wrapper library for [`@linkurious/ogma`](https://ogma.linkurio.us) to use with [React](https://reactjs.org).

  * [Getting started](#getting-started)
  * [Usage](#usage)
  * [API](#api)
    - [`<Ogma />`](#ogma-)
    - Styles:
      - [`<NodeStyle />`](#nodestyle-)
      - [`<EdgeStyle />`](#edgestyle-)
      - [`<StyleClass />`](#styleclass-)
    - Overlays:
      - [`<Popup />`](#popup-)
      - [`<Tooltip />`](#tooltip-)
      - [`<CanvasLayer />`](#canvaslayer-)
      - [`<Layer />`](#layer-)
      - [`<Overlay />`](#overlay-)
    - Transformations:
      - [`<NodeGrouping />`](#nodegrouping-)
      - [`<EdgeGrouping />`](#edgegrouping-)
      - [`<NodeFilter />`](#nodefilter-)
      - [`<EdgeFilter />`](#edgefilter-)
      - [`<NeighborGeneration />`](#neighborgeneration-)
      - [`<NeighborMerging />`](#neighbormerging-)
      - [`<NodeCollapsing />`](#nodecollapsing-)
      - [`<NodeDrilldown />`](#nodedrilldown-)
    - [`<Geo />`](#geo-)

## Getting Started

Add `@linkurious/ogma` and `@linkurious/ogma-react` to your project. For Ogma, you should use you NPM link from [get.linkurio.us](https://get.linkurio.us).

```bash
npm install <YOUR_LINK_WITH_API_KEY>
npm i @linkurious/ogma-react --save
```

Or, with yarn:

```
yarn i <YOUR_LINK_WITH_API_KEY>
yarn add @linkurious/ogma-react
```

You will need the CSS or Styled Components (see [`demo/src/index.css`](https://github.com/Linkurious/ogma-react/blob/develop/demo/src/index.css) for an example). No CSS is included by default.

```tsx
import { Ogma, NodeStyle, Popup, useEvent } from '@linkurious/ogma-react';
import { Ogma as OgmaLib, MouseButtonEvent, Node as OgmaNode } from '@linkurious/ogma';
...
const [clickedNode, setClickedNode] = useState<OgmaNode|null>(null);
const ogmaRef = useRef<OgmaLib>();
const onMousemove = useEvent('mousemove', ({ target }) => {
  if (target && target.isNode) console.log(target.getId());
});

const onClick = useEvent('click', ({ target }) => {
  setClickedNode((target && target.isNode) ? target : null);
});

<Ogma
  options={...}
  onMousemove={onMousemove}
  onClick={onClick}
  ref={ogmaRef}
  onReady={(ogma) => console.log('ogma instance initialized')}
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

See the [`demo/src/App.tsx`](https://github.com/Linkurious/ogma-react/blob/develop/demo/src/App.tsx) file for a complete example.

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
  import { useOgma } from '@linkurious/ogma-react';
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
      };
    }, []);

    return null;
  }
  ```


`App.tsx`:
```tsx
import { LayoutService } from './components/LayoutService';

export default function App() {
  ... // retrieve the graph here

  return (<Ogma options={options} graph={graph}>
    <LayoutService />
  </Ogma>);
}
```

### How to load the graph

```tsx
import { useState, useEffect } from 'react';
import { RawGraph } from '@linkurious/ogma';
import { Ogma } from '@linkurious/ogma-react';

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
import { Ogma as OgmaLib, RawGraph } from '@linkurious/ogma';
import { Ogma } from '@linkurious/ogma-react';

export default function App () {
  const [isLoading, setIsLoading] = useState(true);
  const [graph, setGraph] = useState<RawGraph>();

  // using ogma parser to parse GEXF format
  useEffect(() => {
    fetch('/graph.gexf')
      .then(res => res.text())
      .then(gexf => OgmaLib.parse.gexf(gexf))
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
  - [`<StyleClass />`](#styleclass-)
- Overlays:
  - [`<Popup />`](#popup-)
  - [`<Tooltip />`](#tooltip-)
  - [`<CanvasLayer />`](#canvaslayer-)
  - [`<Layer />`](#layer-)
  - [`<Overlay />`](#overlay-)
- Transformations:
  - [`<NodeGrouping />`](#nodegrouping-)
  - [`<EdgeGrouping />`](#edgegrouping-)
  - [`<NodeFilter />`](#nodefilter-)
  - [`<EdgeFilter />`](#edgefilter-)
  - [`<NeighborGeneration />`](#neighborgeneration-)
  - [`<NeighborMerging />`](#neighbormerging-)
  - [`<NodeCollapsing />`](#nodecollapsing-)
  - [`<NodeDrilldown />`](#nodedrilldown-)
- [`<Geo />`](#geo-)

## API

### `<Ogma />`

Main visualisation component. You can use `onReady` or `ref` prop to get a reference to the Ogma instance.

#### Props

| Prop       | Type                   | Default | Description |
| ---------- | ---------------------- | ------- | ----------- |
| `className?`     | `string`      | `ogma-container`  | className for the ogma container                                                                      |
| `graph?`   | `Ogma.RawGraph`        | `null`  | The graph to render                                                                                                                                                     |
| `onEventName?` | `(event: EventTypes<ND, ED>[K]) => void`      | `null`  | The handler for an [event](https://doc.linkurious.com/ogma/latest/api/events.html). The passed in function should always be the result of the `useEvent` hook to have a stable function identity and avoid reassigning the same handler at every render. |
| `onReady?` | `(ogma: Ogma) => void` | `null`  | Callback when the Ogma instance is ready                                                                                                                                |
| `options?` | [`Ogma.Options`](https://doc.linkurio.us/ogma/latest/api.html#Options)         | `{}`    | Ogma options                                                                                                                                                            |
| `theme?` | [`Ogma.Theme`](https://doc.linkurious.com/ogma/latest/api/types/theme.html) | `null`  | The theme of the graph. Keep in mind that adding `<NodeStyle>` and `<EdgeStyle>` components will overwrite the theme's styles |
| `children?` | `React.ReactNode`      | `null`  | The children of the component, such as `<Popup>` or `<Tooltip>` or your custom component. Ogma instance is avalable to the children components through `useOgma()` hook |
| `ref?`     | `React.Ref<Ogma>`      | `null`  | Reference to the Ogma instance                                                                                                                                          |

### `<NodeStyle />`

Node style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | [`Ogma.NodeAttributesValue`](https://doc.linkurious.com/ogma/latest/api/types/nodeattributesvalue.html) | `{}`    | Attributes to apply to the node              |
| `selector?`  | `(node: Ogma.Node) => boolean` | `null`  | Selector to apply the attributes to the node |
| `ref?`       | `React.Ref<Ogma.StyleRule>`    | `null`  | Reference to the style rule                  |

#### Example

```tsx
<Ogma>
  <NodeStyle attributes={{ color: "red", radius: 10 }} />
</Ogma>
```

### `<NodeStyle.Hovered />`

Node style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | [`Ogma.HoverNodeOptions`](https://doc.linkurious.com/ogma/latest/api/types/hovernodeoptions.html)      | `{}`    | Attributes to apply to the hovered node              |
| `fullOverwrite?`  | `boolean` | `false`  | If `false`, the specified attributes will be merged with the current attributes. If `true`, the attributes applied on hover will be exactly the ones supplied. |

#### Example

```tsx
<Ogma>
  <NodeStyle.Hovered attributes={{ color: "red", radius: 10 }} />
</Ogma>
```

### `<NodeStyle.Selected />`

Node style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | [`Ogma.NodeAttributesValue`](https://doc.linkurious.com/ogma/latest/api/types/nodeattributesvalue.html)  | `{}`    | Attributes to apply to the selected node              |
| `fullOverwrite?`  | `boolean` | `false`  | If `false`, the specified attributes will be merged with the current attributes. If `true`, the attributes applied on selection will be exactly the ones supplied. |

#### Example

```tsx
<Ogma>
  <NodeStyle.Selected attributes={{ color: "red", radius: 10 }} />
</Ogma>
```

### `<EdgeStyle />`

Edge style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | [`Ogma.EdgeAttributesValue`](https://doc.linkurious.com/ogma/latest/api/types/edgeattributesvalue.html)      | `{}`    | Attributes to apply to the edge              |
| `selector?`  | `(edge: Ogma.Edge) => boolean` | `null`  | Selector to apply the attributes to the edge |
| `ref?`       | `React.Ref<Ogma.StyleRule>`    | `null`  | Reference to the style rule                  |

#### Example

```tsx
<Ogma>
  <EdgeStyle attributes={{ color: "red" }} />
</Ogma>
```

### `<EdgeStyle.Hovered />`

Edge style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | `Ogma.HoveredEdgeOptions`      | `{}`    | Attributes to apply to the Hovered edge              |
| `fullOverwrite?`  | `boolean` | `false`  | If `false`, the specified attributes will be merged with the current attributes. If `true`, the attributes applied on hover will be exactly the ones supplied. |

#### Example

```tsx
<Ogma>
  <EdgeStyle.Hovered attributes={{ color: "red" }} />
</Ogma>
```

### `<EdgeStyle.Selected />`

Edge style component.

#### Props

| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| `attributes` | [`Ogma.EdgeAttributesValue`](https://doc.linkurious.com/ogma/latest/api/types/edgeattributesvalue.html)      | `{}`    | Attributes to apply to the selected edge              |
| `fullOverwrite?`  | `boolean` | `false`  | If `false`, the specified attributes will be merged with the current attributes. If `true`, the attributes applied on selection will be exactly the ones supplied. |

#### Example

```tsx
<Ogma>
  <EdgeStyle.Selected attributes={{ color: "red" }} />
</Ogma>
```

### `<StyleClass />`

Wrapper to the Ogma `StyleClass` class. It allows you to apply styles to nodes and edges based on their `class`, much like in CSS.

#### Props
| Prop         | Type                           | Default | Description                                  |
| ------------ | ------------------------------ | ------- | -------------------------------------------- |
| **`name`**  | `string`                       |   | The class name to apply the styles to        |
| `edgeAttributes?` | [`Ogma.EdgeAttributesValue`](https://doc.linkurious.com/ogma/latest/api/types/edgeattributesvalue.html) | `{}`    | Attributes to apply to the edges             |
| `nodeAttributes?` | [`Ogma.NodeAttributesValue`](https://doc.linkurious.com/ogma/latest/api/types/nodeattributesvalue.html) | `{}`    | Attributes to apply to the nodes or edges    |


### Example

```tsx
useEffect(() => {
  ogma.getNode('x').addClass('my-class');
}, []);

return (<Ogma>
  <StyleClass
    name="my-class"
    nodeAttributes={{ color: "red", radius: 10 }}
    edgeAttributes={{ color: "blue" }}
  />
</Ogma>);
```

### `<Popup />`

Custom popup UI layer.

#### Props

| Prop               | Type               | Default                 | Description                                                  |
| ------------------ | ------------------ | ----------------------- | ----------------------------------------------------------- |
| `closeOnEsc?`      | `boolean`          | `true`                  | Whether to close the popup when the user presses the ESC key |
| `closePopupClass?` | `string`           | `'ogma-popup--close'`   | Class name to apply to the close button                      |
| `contentClass?`    | `string`           | `'ogma-popup--content'` | Class name to apply to the popup content                     |
| `isOpen?`           | `boolean`          | `true`                  | Whether the popup is open                                    |
| `onClose?`          | `() => void`       | `null`                  | Callback when the popup is closed                            |
| `placement?`        | `'top' \| 'bottom' \| 'right'\| 'left'` | Placement of the popup |
| `popupBodyClass?`  | `string`           | `'ogma-popup--body'`    | Class name to apply to the popup body                        |
| `popupClass?`      | `string`           | `'ogma-popup'`          | Class name to apply to the popup container                   |
| `position`         | `Point \| (ogma: Ogma) => Point`  | `null`                                                       | Position of the popup               |
| `size?`            | `{ width: number \| 'auto'; height: number \| 'auto'; }`                                                   | `{ width: 'auto', height: 'auto' }` | Size of the popup      |
| `children?`         | `React.ReactNode`  | `null`                  | The children of the component                                |
| `ref?`             | `React.Ref<Popup>` | `null`                  | Reference to the popup                                       |


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

Tooltip component. It automatically adjusts the position of the tooltip based on the target of the event (or is static if position is defined). Its children can be a function that returns a ReactNode
and has the target of the event as argument.

#### Props

| Prop        | Type              | Default                | Description                   |
| ----------- | ----------------- | ---------------------- | ----------------------------- |
| `bodyClass?` | `string`        | `'ogma-popup--body'`      | The class name to add to the tooltip container |
| `eventName`  | `keyof TooltipEventFunctions` |  | The name of the event to show the tooltip            |
| `placement?` | `Placement`       | `top`                | The placement of the tooltip      |
| `position?`  | `Point` | `null` | The position of the tooltip if static            |
| `size?`     | `{ width: number  \| 'auto'; height: number \| 'auto'; }` | `{ width: 'auto', height: 'auto' }` | The size of the tooltip |
| `translate?` | `{ x: number, y: number }`        | `{ x: 0, y: 0 }`      | The amount of pixels to translate the tooltip container |
| `children?`  | `React.ReactNode \| (Node \| Edge \| Point) => React.ReactNode` | `null`                 | The children of the component |
| `ref?`      | `React.Ref<Overlay>` | `null`              | Reference to the tooltip      |

#### Example

```tsx
<Ogma>
  <Tooltip
    eventName="nodeHover"
    className="ogma-tooltip"
  >
    {(target) => {
      return (
        <div>
          {target.getId()}
        </div>
      )
    }}
  </Tooltip>
</Ogma>
```

### `<CanvasLayer />`

Custom canvas layer.

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `index?` | `number` | `1` | The index of the layer |
| `isStatic?` | `boolean` | `false` | Whether the layer is static |
| `noClear?` | `boolean` | `false` | Whether to clear the canvas before rendering |
| `render` | `(ctx: CanvasRenderingContext2D) => void` | `null` | Callback to render the canvas layer |
| `visible?` | `boolean` | `true` | The visibility of the canvas |
| `ref?` | `React.Ref<CanvasLayer>` | `null` | Reference to the canvas layer |

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

### `<Layer />`

Generic DOM layer, see [`ogma.layers.addLayer`](https://doc.linkurious.com/ogma/latest/api.html#Ogma-layers-addLayer).

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `className?`         | `string`  | `""`| The class name of the layer |
| `index?`         | `number`  | `null`| The index of the layer |
| `children?`         | `React.ReactNode`  | `null`| The children of the layer |
| `ref?`         | `React.Ref<Layer>`  | `null`| The reference to the layer |

#### Example

```tsx
<Ogma>
  <Layer>
    <span>Layer content here!</span>
  </Layer>
</Ogma>
```

### `<Overlay />`

Generic Overlay layer, see [`ogma.layers.addOverlay`](https://doc.linkurious.com/ogma/latest/api.html#Ogma-layers-addOverlay).

#### Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children?`         | `React.ReactNode`  | `null`| The children of the layer |
| `className?`         | `string`  | `null`| The classname for the Overlay |
| `position`  | `Point \| (ogma: Ogma) => Point` |  | The position of the Overlay             |
| `scaled?`         | `boolean`  | `true`| Whether the Overlay is scaled on zoom or not |
| `size?`     | `{ width: number  \| 'auto'; height: number \| 'auto'; }` | `{ width: 'auto', height: 'auto' }` | The size of the Overlay |
| `ref?`         | `React.Ref<Overlay>`  | `null`| The reference to the overlay |


#### Example

```tsx
<Ogma>
  <Overlay position={{x: 0, y: 0}} >
    <span>Layer content here!</span>
  </Overlay>
</Ogma>
```

## Transformations

All transformations have callback props, making it easy to react to events related to transformations.
| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `onEnabled`  | `(t: Transformation) => void` | `null`  | Triggered when transformation is enabled   |
| `onUpdated`  | `(t: Transformation) => void` | `null`  | Triggered when transformation is refreshed |
| `onDisabled` | `(t: Transformation) => void` | `null`  | Triggered when transformation is disabled |
| `onDestroyed`| `(t: Transformation) => void` | `null`  | Triggered when transformation is destroyed |
| `onSetIndex` | `(t: Transformation, i: number) => void` | `null`  | Triggered when transformation changes index |


### `<NodeGrouping />`

Node grouping transformation. See [`ogma.transformations.addNodeGrouping()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeGrouping) for more details.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector?`   | `(node: Ogma.Node) => boolean` | `null`  | Selector to apply the attributes to the node |
| `groupIdFunction?` | `(node: Ogma.Node) => string \| undefined`      |     | Grouping function              |
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
| `selector?`   | `(edge: Ogma.Edge) => boolean` | `null`  | Selector for the edges |
| `groupIdFunction?` | `(edge: Ogma.Edge) => string \| undefined`      |     | Grouping function              |
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

### `<NodeFilter />`

Node filter transformation. See [`ogma.transformations.addNodeFilter()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeFilter) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `...props`   | `Ogma.NodeFilterOptions` |  | See [`ogma.transformations.addNodeFilter()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeFilter) for more information. |

#### Example

```tsx
<Ogma graph={...}>
  <NodeFilter
    criteria={node => node.getData('age') > 22}
    disabled={false}
  />
</Ogma>
```

### `<EdgeFilter />`

Wrapper for the edge filter transformation. See [`ogma.transformations.addEdgeFilter()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeFilter) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `...props`   | `Ogma.EdgeFilterOptions` |  | See [`ogma.transformations.addEdgeFilter()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeFilter) for more information. |

#### Example

```tsx
<Ogma graph={...}>
  <EdgeFilter
    criteria={edge => edge.getData('type') === 'important'}
    disabled={false}
  />
</Ogma>
```

### `<NeighborMerging />`

Neighbor merging transformation. See [`ogma.transformations.addNeighborMerging()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNeighborMerging) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `selector?`   | `(node: Ogma.Node) => boolean` | `null`  | Selector |
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
| `selector?`   | `(node: Ogma.Node) => boolean` | `null`  | Selector |
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
| `selector?`   | `(node: Ogma.Node) => boolean` | `null`  | Selector |
| `edgeGenerator?` | `(hiddenNode: Ogma.Node, node1: Ogma.Node, node2: Ogma.Node, edges1: Ogma.EdgeList, edges2: Ogma.EdgeList): RawEdge|null)` |     | Edge generator function              |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addNodeCollapsing()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeCollapsing) properties | | Transformation properties |

### `<NodeDrilldown />`

Node drilldown transformation. See [`ogma.transformations.addDrillDown()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addDrillDown) for more information.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `parentPath?`   | `string` | `null`  | Path to the parent node ID in the node data |
| `depthPath?` | `string`      |     | Path to the depth value in the node data              |
| `nodeGenerator?` | `(node: Ogma.Node) => RawNode \| RawNode[] \| null`      |     | Function to generate child nodes              |
| `showContents?` | `boolean` | `true`  | Whether to show the contents of the drilled down node |
| `copyData?` | `boolean` | `false`  | Whether to copy data from parent to generated nodes |
| `padding?` | `number` | `null`  | Padding around the drilled down content |
| `ref?`       | `React.Ref<Ogma.Transformation>`    | `null`  | Reference to the transformation                  |
| `...rest` | See [`ogma.transformations.addDrillDown()`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addDrillDown) properties | | Drilldown transformation properties |

#### Example

```tsx
<Ogma graph={...}>
  <NodeDrilldown
    parentPath="data.parentId"
    depthPath="data.depth"
    nodeGenerator={node => ({
      id: `${node.getId()}-child`,
      data: { parentId: node.getId() }
    })}
    disabled={false}
  />
</Ogma>
```

### `<Geo />`

Geo mode component. It's the first version of this component and we are still gathering feedback on how you can use it.

#### Props

| Prop         | Type                           | Default | Description |
| ------------ | ------------------------------ | ------- | ----------- |
| `enabled?`       | `boolean`    | `false`  | On/off toggle |
| `...rest` | `Ogma.GeomModeOptions`  | | See [`GeoModeOptions`](https://doc.linkurio.us/ogma/latest/api.html#GeoModeOptions) properties |

#### Example

```tsx
<Ogma graph={...}>
  <Geo
    enabled={true}
    tileUrlTemplate="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
    longitudePath="data.lng"
    latitudePath="data.lat"
  />
</Ogma>
```


## `<React.StrictMode/>` incompatibility

If you are using `<React.StrictMode/>` in your application, you may encounter issues with the Ogma instance being created multiple times. This is due to the way React.StrictMode works, which intentionally invokes components twice to help identify side effects. It's not compatible with the way components like `<Ogma />` are designed to work.
To avoid this issue, we highly recommend not using `<React.StrictMode/>` in your application when using `@linkurious/ogma-react`. If you need to use strict mode, consider wrapping only parts of your application that do not include Ogma components or implementing the mount counters.



## License

Apache 2.0


