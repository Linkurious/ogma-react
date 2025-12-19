import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef
} from "react";
import {
  NeighborMergingOptions,
  NeighborMerging as NeighborMergingTransformation
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

interface NeighborMergingPropsC<ND, ED>
  extends NeighborMergingOptions<ND, ED>,
    TransformationProps<ND, ED, NeighborMergingOptions<ND, ED>> {}

export type NeighborMergingProps<ND, ED> = Omit<NeighborMergingPropsC<ND, ED>, "enabled">;

function NeighborMergingComponent<ND = unknown, ED = unknown>(
  props: NeighborMergingProps<ND, ED>,
  ref: Ref<NeighborMergingTransformation<ND, ED>>
) {
  const ogma = useOgma<ND, ED>();
  const [transformation, setTransformation] =
    useState<NeighborMergingTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNeighborMerging({
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
  }, [props.dataFunction, props.selector]);

  return null;
}

type NeighborMergingType = <ND, ED>(
  props: NeighborMergingProps<ND, ED> & { ref?: Ref<NeighborMergingTransformation<ND, ED>> }
) => React.ReactElement | null;

export const NeighborMerging = forwardRef(NeighborMergingComponent) as NeighborMergingType;