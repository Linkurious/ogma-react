import {
  useEffect,
  useState,
  Ref,
  useImperativeHandle,
  forwardRef
} from "react";
import {
  NodeFilterOptions,
  NodeFilter as NodeFilterTransformation
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { TransformationProps } from "./types";
import { toggle, useTransformationCallbacks } from "./utils";

interface NodeFilterPropsC<ED, ND>
  extends NodeFilterOptions<ED, ND>,
    TransformationProps<ND, ED, NodeFilterOptions<ED, ND>> {}

export type NodeFilterProps<ND, ED> = Omit<NodeFilterPropsC<ND, ED>, "enabled">;

function NodeFilterComponent<ND = unknown, ED = unknown>(
  props: NodeFilterProps<ND, ED>,
  ref?: Ref<NodeFilterTransformation<ND, ED>>
) {
  const ogma = useOgma<ND, ED>();
  const [transformation, setTransformation] =
    useState<NodeFilterTransformation<ND, ED>>();

  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeFilter({
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
  }, [props.disabled]);

  useEffect(() => {
    transformation?.setOptions(props);
  }, [props.criteria]);

  return null;
}

type NodeFilterType = <ND, ED>(
  props: NodeFilterProps<ND, ED> & { ref?: Ref<NodeFilterTransformation<ND, ED>> }
) => React.ReactElement | null;

/**
 * Edge Filter transformation component. It wraps around Ogma [`NodeFilter` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-transformations-addNodeFilter).
 */
export const NodeFilter = forwardRef(NodeFilterComponent) as NodeFilterType;
