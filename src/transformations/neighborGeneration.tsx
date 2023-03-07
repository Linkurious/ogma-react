import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NeighborGenerationOptions,
  Transformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { EnabledState } from "./types";
import { toggle } from "./utils";

interface NeighborGenerationProps<ND, ED>
  extends NeighborGenerationOptions<ND, ED>,
  EnabledState { }

function NeighborGenerationComponent<ND = any, ED = any>(
  props: NeighborGenerationProps<ND, ED>,
  ref: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNeighborGeneration(props);
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
  }, [props.edgeGenerator, props.nodeGenerator, props.neighborIdFunction, props.selector])

  return null;
}

export const NeighborGeneration = forwardRef(NeighborGenerationComponent);
