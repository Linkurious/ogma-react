import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, { NodeFilterOptions, Transformation } from "@linkurious/ogma";
import { useOgma } from "../context";
import { EnabledState } from "./types";
import { toggle } from "./utils";

interface NodeFilterProps<ED, ND>
  extends NodeFilterOptions<ED, ND>,
  EnabledState { }

function NodeFilterComponent<ND = any, ED = any>(
  props: NodeFilterProps<ND, ED>,
  ref?: Ref<Transformation<ND, ED>>
) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useImperativeHandle(ref, () => transformation as Transformation<ND, ED>, [
    transformation,
  ]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeFilter(props);
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
  }, [props.criteria])

  return null;
}

/**
 * Edge Filter transformation component. It wraps around Ogma [`NodeFilter` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeFilter).
 */
export const NodeFilter = forwardRef(NodeFilterComponent);
