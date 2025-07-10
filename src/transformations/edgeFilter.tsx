import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef
} from "react";
import {
  EdgeFilterOptions,
  EdgeFilter as EdgeFilterTransformation
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

interface EdgeFilterPropsC<ND, ED>
  extends EdgeFilterOptions<ND, ED>,
    TransformationProps<ND, ED, EdgeFilterOptions<ND, ED>> {};

export type EdgeFilterProps<ND, ED> = Omit<EdgeFilterPropsC<ND, ED>, "enabled">;

function EdgeFilterComponent<ND = any, ED = any>(
  props: EdgeFilterProps<ND, ED>,
  ref?: Ref<EdgeFilterTransformation<ND, ED>>
) {
  const ogma = useOgma<ND, ED>();
  const [transformation, setTransformation] =
    useState<EdgeFilterTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addEdgeFilter({
      ...props,
      enabled: !props.disabled
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
