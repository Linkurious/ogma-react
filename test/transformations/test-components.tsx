
import graph from "../fixtures/simple_graph.json";
import { Ogma as OgmaLib } from "@linkurious/ogma";

import { Ogma, EdgeFilter, EdgeFilterProps, NodeFilter, NodeFilterProps } from "../../src";
import { createRef, forwardRef, useState } from "react";

export const ref = createRef<OgmaLib>();

function EdgeFilterTestC(filter: Partial<EdgeFilterProps<unknown, unknown>> = {}) {
  console.log('filter', filter)
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
  console.log('filter', filter)
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


export const EdgeFilterTest = forwardRef(EdgeFilterTestC);
export const NodeFilterTest = forwardRef(NodeFilterTestC);

