import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  NeighborMergingOptions,
  NeighborMerging as NeighborMergingTransformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

export interface NeighborMergingProps<ND, ED>
  extends NeighborMergingOptions<ND, ED>,
    TransformationProps<ND, ED, NeighborMergingOptions<ND, ED>> {}

function NeighborMergingComponent<ND = any, ED = any>(
  props: NeighborMergingProps<ND, ED>,
  ref: Ref<NeighborMergingTransformation<ND, ED>>,
) {
  const ogma = useOgma<ND, ED>();
  const [transformation, setTransformation] =
    useState<NeighborMergingTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNeighborMerging({
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
  }, [props.dataFunction, props.selector]);

  return null;
}

export const NeighborMerging = forwardRef(NeighborMergingComponent);
