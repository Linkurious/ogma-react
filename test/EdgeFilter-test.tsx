
import graph from "./fixtures/simple_graph.json";
import { Ogma as OgmaLib } from "@linkurious/ogma";

import { Ogma, EdgeFilter, EdgeFilterProps } from "../src";
import { createRef, forwardRef, useState } from "react";



export const ref = createRef<OgmaLib>();

function EdgeFilterTestC() {

  const [props, setProps] = useState<EdgeFilterProps<unknown, unknown>>({
    criteria: (edge) => edge.getId() === 0,
  });
  function updateFilter() {
    setProps({
      criteria: (edge) => edge.getId() === 1,
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
