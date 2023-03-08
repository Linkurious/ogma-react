
import graph from "../fixtures/simple_graph.json";
import graphCurved from "../fixtures/simple_graph_curved.json";

import { Ogma as OgmaLib } from "@linkurious/ogma";

import {
  Ogma, EdgeFilter, EdgeFilterProps, NodeFilter, NodeFilterProps,
  EdgeGrouping, EdgeGroupingProps,
  NodeGrouping, NodeGroupingProps,
  NeighborGeneration, NeighborGenerationProps,
  NeighborMerging, NeighborMergingProps,
  NodeCollapsing, NodeCollapsingProps,


} from "../../src";
import { createRef, forwardRef, useState } from "react";

export const ref = createRef<OgmaLib>();

function EdgeFilterTestC(filter: Partial<EdgeFilterProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<EdgeFilterProps<unknown, unknown>>({
    criteria: (edge) => edge.getId() === 0,
    disabled: false,
    ...filter
  });
  function updateFilter() {
    setProps({
      criteria: (edge) => edge.getId() === 1,
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateFilter}>setCriteria</button>
    <button onClick={toggle}>toggle</button>

    <Ogma graph={graph} ref={ref}>
      <EdgeFilter criteria={props.criteria} disabled={props.disabled} />
    </Ogma>
  </div >)

}
function NodeFilterTestC(filter: Partial<NodeFilterProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<NodeFilterProps<unknown, unknown>>({
    criteria: (node) => node.getId() === 0,
    disabled: false,
    ...filter
  });
  function updateFilter() {
    setProps({
      criteria: (node) => node.getId() === 1,
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateFilter}>setCriteria</button>
    <button onClick={toggle}>toggle</button>

    <Ogma graph={graph} ref={ref}>
      <NodeFilter criteria={props.criteria} disabled={props.disabled} />
    </Ogma>
  </div >)

}

function EdgeGroupingTestC(grouping: Partial<EdgeGroupingProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<EdgeGroupingProps<unknown, unknown>>({
    selector: (edge) => !!(+edge.getId() % 2),
    groupIdFunction: (edge) => `group-1`,
    separateEdgesByDirection: false,
    generator(edges, groupId, transformation) {
      return {
        id: groupId,
        data: { key: 'value' }
      };
    },
    disabled: false,
    ...grouping
  });
  function updateGrouping() {
    setProps({
      ...props,
      selector: () => true,
      groupIdFunction: (edge) => `group-${+edge.getId() % 2}`,
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateGrouping}>setGrouping</button>
    <button onClick={toggle}>toggle</button>

    <Ogma graph={graphCurved} ref={ref}>
      <EdgeGrouping
        groupIdFunction={props.groupIdFunction}
        disabled={props.disabled}
        selector={props.selector}
        generator={props.generator}
        separateEdgesByDirection={props.separateEdgesByDirection} />
    </Ogma>
  </div >)
}

function NodeGroupingTestC(grouping: Partial<NodeGroupingProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<NodeGroupingProps<unknown, unknown>>({
    selector: (node) => !!(+node.getId() % 2),
    groupIdFunction: (node) => `group-1`,
    separateEdgesByDirection: false,
    nodeGenerator(nodes, groupId, transformation) {
      return {
        id: groupId,
        data: { key: 'value' }
      };
    },
    disabled: false,
    ...grouping
  });
  function updateGrouping() {
    setProps({
      ...props,
      selector: () => true,
      groupIdFunction: (node) => `group-${+node.getId() % 2}`,
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateGrouping}>setGrouping</button>
    <button onClick={toggle}>toggle</button>

    <Ogma graph={graph} ref={ref}>
      <NodeGrouping
        groupIdFunction={props.groupIdFunction}
        disabled={props.disabled}
        selector={props.selector}
        nodeGenerator={props.nodeGenerator}
        separateEdgesByDirection={props.separateEdgesByDirection} />
    </Ogma>
  </div >)
}

function NeighborGenerationTestC(generator: Partial<NeighborGenerationProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<NeighborGenerationProps<unknown, unknown>>({
    selector: (node) => +node.getId() % 2 === 0,
    neighborIdFunction: () => `even`,
    disabled: false,
    ...generator
  });
  function updateGenerator() {
    setProps({
      ...props,
      selector: () => true,
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateGenerator}>setGenerator</button>
    <button onClick={toggle}>toggle</button>

    <Ogma graph={{ nodes: graph.nodes, edges: [] }} ref={ref}>
      <NeighborGeneration
        selector={props.selector}
        disabled={props.disabled}
        nodeGenerator={props.nodeGenerator}
        neighborIdFunction={props.neighborIdFunction}
      />
    </Ogma>
  </div >)
}

function NeighborMergingTestC(generator: Partial<NeighborMergingProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<NeighborMergingProps<unknown, unknown>>({
    selector: (node) => +node.getId() === 1,
    dataFunction: () => ({ value: 1 }),
    disabled: false,
    ...generator
  });
  function updateGenerator() {
    setProps({
      ...props,
      selector: (node) => +node.getId() === 0,
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateGenerator}>setGenerator</button>
    <button onClick={toggle}>toggle</button>

    <Ogma graph={graph} ref={ref}>
      <NeighborMerging
        selector={props.selector}
        disabled={props.disabled}
        dataFunction={props.dataFunction}
      />
    </Ogma>
  </div >)
}

function NodeCollapsingTestC(generator: Partial<NodeCollapsingProps<unknown, unknown>> = {}) {
  const [props, setProps] = useState<NodeCollapsingProps<unknown, unknown>>({
    selector: (node) => +node.getId() === 0,
    edgeGenerator: () => {
      return { data: { key1: 'value1' } };
    },
    disabled: false,
    ...generator
  });
  function updateCollapse() {
    setProps({
      ...props,
      edgeGenerator: () => {
        return { data: { key2: 'value2' } };
      },
    })
  }
  function toggle() {
    setProps({
      ...props,
      disabled: !props.disabled
    })
  }
  return (< div >
    <button onClick={updateCollapse}>setCollapse</button>
    <button onClick={toggle}>toggle</button>
    <Ogma graph={graph} ref={ref}>
      <NodeCollapsing
        selector={props.selector}
        disabled={props.disabled}
        edgeGenerator={props.edgeGenerator}
      />
    </Ogma>
  </div >)
}


export const EdgeFilterTest = forwardRef(EdgeFilterTestC);
export const NodeFilterTest = forwardRef(NodeFilterTestC);
export const EdgeGroupingTest = forwardRef(EdgeGroupingTestC);
export const NodeGroupingTest = forwardRef(NodeGroupingTestC);
export const NeighborGenerationTest = forwardRef(NeighborGenerationTestC);
export const NeighborMergingTest = forwardRef(NeighborMergingTestC);
export const NodeCollapsingTest = forwardRef(NodeCollapsingTestC);




