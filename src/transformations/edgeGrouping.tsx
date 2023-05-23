import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, { EdgeGroupingOptions, Transformation } from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

export interface EdgeGroupingProps<ED, ND>
  extends EdgeGroupingOptions<ED, ND>,
  TransformationProps { }

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
    const newTransformation = ogma.transformations.addEdgeGrouping({
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
  }, [props.selector, props.generator, props.groupIdFunction, props.separateEdgesByDirection])

  return null;
}

/**
 * Edge grouping transformation component. It wraps around Ogma [`EdgeGrouping` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeGrouping).
 */
export const EdgeGrouping = forwardRef(EdgeGroupingComponent);
