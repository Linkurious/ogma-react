import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NeighborMergingOptions,
  Transformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

export interface NeighborMergingProps<ND, ED>
  extends NeighborMergingOptions<ND, ED>,
  TransformationProps { }

function NeighborMergingComponent<ND = any, ED = any>(
  props: NeighborMergingProps<ND, ED>,
  ref: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

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
  }, [props.dataFunction, props.selector])

  return null;
}

export const NeighborMerging = forwardRef(NeighborMergingComponent);
