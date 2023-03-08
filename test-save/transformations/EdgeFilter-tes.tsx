
import graph from "../fixtures/simple_graph.json";
import { Ogma, EdgeFilter, EdgeFilterProps } from "../../src";
import { forwardRef, useState } from "react";



function EdgeFilterTestC(ref: any) {

  const [props, setProps] = useState<EdgeFilterProps<unknown, unknown>>({
    criteria: (edge) => edge.getId() === 1,
  });

  function updateFilter() {
    setProps({
      criteria: (edge) => edge.getId() === 2,
    })
  }
  return (< div >
    <button onClick={updateFilter}>setCriteria</button>
    <Ogma graph={graph} ref={ref}>
      <EdgeFilter criteria={props.criteria} />
    </Ogma>
  </div >)

}

export const EdgeFilterTest = forwardRef(EdgeFilterTestC);
