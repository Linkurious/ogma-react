import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, { EdgeFilterOptions, Transformation } from "@linkurious/ogma";
import { useOgma } from "../context";
import { EnabledState } from "./types";
import { toggle } from "./utils";

interface EdgeFilterProps<ED, ND>
  extends EdgeFilterOptions<ED, ND>,
    EnabledState {}

function EdgeFilterComponent<ND = any, ED = any>(
  props: EdgeFilterProps<ED, ND>,
  ref?: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addEdgeFilter(props);
    setTransformation(newTransformation);
    return () => {
      newTransformation.destroy();
      setTransformation(undefined);
    };
  }, []);

  useEffect(() => {
    if (transformation) {
      toggle(transformation, !!props.disabled, props.duration);
    }
  }, [props.disabled]);

  return null;
}

/**
 * Edge Filter transformation component. It wraps around Ogma [`EdgeFilter` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeFilter).
 */
export const EdgeFilter = forwardRef(EdgeFilterComponent);
