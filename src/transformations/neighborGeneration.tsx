import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef
} from "react";
import {
  NeighborGenerationOptions,
  NeighborGeneration as NeighborGenerationTransformation
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

interface NeighborGenerationPropsC<ND, ED>
  extends NeighborGenerationOptions<ND, ED>,
    TransformationProps<ND, ED, NeighborGenerationOptions<ND, ED>> {};

export type NeighborGenerationProps<ND, ED> = Omit<NeighborGenerationPropsC<ND, ED>, "enabled">;

function NeighborGenerationComponent<ND = any, ED = any>(
  props: NeighborGenerationProps<ND, ED>,
  ref: Ref<NeighborGenerationTransformation<ND, ED>>
) {
  const ogma = useOgma<ND, ED>();
  const [transformation, setTransformation] =
    useState<NeighborGenerationTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNeighborGeneration({
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
    props.edgeGenerator,
    props.nodeGenerator,
    props.neighborIdFunction,
    props.selector
  ]);

  return null;
}

type NeighborGenerationType = <ND, ED>(
  props: NeighborGenerationProps<ND, ED> & { ref?: Ref<NeighborGenerationTransformation<ND, ED>> }
) => React.ReactElement | null;

export const NeighborGeneration = forwardRef(NeighborGenerationComponent) as NeighborGenerationType;