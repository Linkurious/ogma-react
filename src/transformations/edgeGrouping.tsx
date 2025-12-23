import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef
} from "react";
import {
  EdgeGroupingOptions,
  EdgeGrouping as EdgeGroupingTransformation
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

interface EdgeGroupingPropsC<ED, ND>
  extends EdgeGroupingOptions<ED, ND>,
    TransformationProps<ED, ND, EdgeGroupingOptions<ED, ND>> {};

export type EdgeGroupingProps<ND, ED> = Omit<EdgeGroupingPropsC<ND, ED>, "enabled">;

function EdgeGroupingComponent<ND = unknown, ED = unknown>(
  props: EdgeGroupingProps<ED, ND>,
  ref?: Ref<EdgeGroupingTransformation<ED, ND>>
) {
  const ogma = useOgma<ND, ED>();
  const [transformation, setTransformation] =
    useState<EdgeGroupingTransformation<ED, ND>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addEdgeGrouping({
      ...props,
      enabled: !props.disabled
    });
    // @ts-expect-error transformation is generic
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
  }, [props.disabled, props.duration]);

  useEffect(() => {
    transformation?.setOptions(props);
  }, [
    props.selector,
    props.generator,
    props.groupIdFunction,
    props.separateEdgesByDirection
  ]);

  return null;
}

type EdgeGroupingType = <ND, ED>(
  props: EdgeGroupingProps<ND, ED> & { ref?: Ref<EdgeGroupingTransformation<ND, ED>> }
) => React.ReactElement | null;

/**
 * Edge grouping transformation component. It wraps around Ogma [`EdgeGrouping` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addEdgeGrouping).
 */
export const EdgeGrouping = forwardRef(EdgeGroupingComponent) as EdgeGroupingType;
