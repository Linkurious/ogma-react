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
import { EnabledState } from "./types";

interface NeighborMergingProps<ND, ED>
  extends NeighborMergingOptions<ND, ED>,
    EnabledState {}

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
    const newTransformation = ogma.transformations.addNeighborMerging(props);
    setTransformation(newTransformation);
    return () => {
      if (transformation) transformation.destroy();
    };
  }, []);

  return null;
}

export const NeighborMerging = forwardRef(NeighborMergingComponent);
