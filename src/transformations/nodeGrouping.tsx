import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NodeGroupingOptions,
  NodeGrouping as Transformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { toggle, useTransformationCallbacks } from "./utils";
import { TransformationProps } from "./types";

export interface NodeGroupingProps<ND, ED>
  extends NodeGroupingOptions<ND, ED>,
    TransformationProps {}

function NodeGroupingComponent<ND, ED>(
  props: NodeGroupingProps<ND, ED>,
  ref?: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] =
    useState<Transformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);
  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeGrouping({
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
  }, [
    props.groupIdFunction,
    props.groupSelfLoopEdges,
    props.edgeGenerator,
    props.nodeGenerator,
    props.groupEdges,
    props.padding,
    props.selector,
    props.showContents,
    props.separateEdgesByDirection,
  ]);

  return null;
}

export const NodeGrouping = forwardRef(NodeGroupingComponent);
