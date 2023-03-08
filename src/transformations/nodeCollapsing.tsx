import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NodeCollapsingOptions,
  Transformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { EnabledState } from "./types";
import { toggle } from "./utils";

export interface NodeCollapsingProps<ND, ED>
  extends NodeCollapsingOptions<ND, ED>,
  EnabledState { }

export function NodeCollapsingComponent<ND = any, ED = any>(
  props: NodeCollapsingProps<ND, ED>,
  ref: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeCollapsing({
      ...props,
      enabled: !props.disabled
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
  }, [props.edgeGenerator, props.selector])

  return null;
}

export const NodeCollapsing = forwardRef(NodeCollapsingComponent);
