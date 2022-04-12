import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, { NodeGroupingOptions, Transformation } from "@linkurious/ogma";
import { useOgma } from "../context";
import { EnabledState } from "./types";

interface NodeGroupingProps<ND, ED>
  extends NodeGroupingOptions<ND, ED>,
    EnabledState {}

function NodeGroupingComponent<ND, ED>(
  props: NodeGroupingProps<ND, ED>,
  ref?: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeGrouping(props);
    setTransformation(newTransformation);

    return () => {
      newTransformation.destroy();
      setTransformation(undefined);
    };
  }, []);

  useEffect(() => {
    if (transformation) {
      if (props.disabled === transformation.isEnabled()) {
        if (props.disabled) transformation.disable(0);
        else transformation.enable(0);
      }
    }
  }, [props.disabled]);

  return null;
}

export const NodeGrouping = forwardRef(NodeGroupingComponent);
