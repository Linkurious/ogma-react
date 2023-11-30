import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  EdgeFilterOptions,
  EdgeFilter as EdgeFilterTransformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

export interface EdgeFilterProps<ED, ND>
  extends EdgeFilterOptions<ED, ND>,
    TransformationProps<ED, ND, EdgeFilterOptions<ED, ND>> {}

function EdgeFilterComponent<ND = any, ED = any>(
  props: EdgeFilterProps<ED, ND>,
  ref?: Ref<EdgeFilterTransformation<ED, ND>>,
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] =
    useState<EdgeFilterTransformation<ED, ND>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addEdgeFilter({
      ...props,
      enabled: !props.disabled,
    });
    useTransformationCallbacks(props, newTransformation, ogma);
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

  useEffect(() => {
    transformation?.setOptions(props);
  }, [props.criteria]);

  return null;
}

/**
 * Edge Filter transformation component. It wraps around Ogma [`EdgeFilter` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeFilter).
 */
export const EdgeFilter = forwardRef(EdgeFilterComponent);
