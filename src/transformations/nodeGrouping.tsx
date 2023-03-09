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
import { toggle } from "./utils";

export interface NodeGroupingProps<ND, ED>
  extends NodeGroupingOptions<ND, ED>,
  EnabledState { }

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
    const newTransformation = ogma.transformations.addNodeGrouping({
      ...props,
      enabled: !props.disabled,
    });
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
  }, [props.groupIdFunction, props.groupSelfLoopEdges, props.edgeGenerator, props.nodeGenerator, props.groupEdges, props.padding,
  props.selector, props.showContents, props.separateEdgesByDirection])

  return null;
}

export const NodeGrouping = forwardRef(NodeGroupingComponent);
