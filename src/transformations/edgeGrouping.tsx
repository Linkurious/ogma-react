import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, { EdgeGroupingOptions, Transformation } from "@linkurious/ogma";
import { useOgma } from "../context";
import { EnabledState } from "./types";

interface EdgeGroupingProps<ED, ND>
  extends EdgeGroupingOptions<ED, ND>,
    EnabledState {}

function EdgeGroupingComponent<ND = any, ED = any>(
  props: EdgeGroupingProps<ED, ND>,
  ref?: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addEdgeGrouping(props);
    setTransformation(newTransformation);
    return () => {
      if (transformation) transformation.destroy();
    };
  }, []);

  return null;
}

export const EdgeGrouping = forwardRef(EdgeGroupingComponent);