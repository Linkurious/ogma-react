import {
  useEffect,
  useState,
  RefCallback,
  Ref,
  useImperativeHandle,
  forwardRef,
} from "react";
import OgmaLib, {
  NodeGroupingOptions,
  EdgeGroupingOptions,
  NeighborGenerationOptions,
  NodeCollapsingOptions,
  NeighborMergingOptions,
  Transformation,
} from "@linkurious/ogma";
import { useOgma } from "../context";

interface WithTrandformationRef<ND, ED> {
  transformationRef?: RefCallback<Transformation<ND, ED>>;
  disabled?: boolean;
}

interface NodeGroupingProps<ND, ED>
  extends NodeGroupingOptions<ND, ED>,
    WithTrandformationRef<ND, ED> {}

function NodeGroupingComponent<ND, ED>(
  { transformationRef, ...props }: NodeGroupingProps<ND, ED>,
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
    if (transformationRef) transformationRef(newTransformation);

    return () => {
      if (transformation) transformation.destroy();
      setTransformation(undefined);
    };
  }, []);

  useEffect(() => {
    if (transformation) {
      if (props.disabled) transformation.disable(0);
      else transformation.enable(0);
    }
  }, [props.disabled]);

  return null;
}

export const NodeGrouping = forwardRef(NodeGroupingComponent);

interface EdgeGroupingProps<ED, ND>
  extends EdgeGroupingOptions<ED, ND>,
    WithTrandformationRef<ND, ED> {}

export function EdgeGrouping<ND = any, ED = any>({
  transformationRef,
  ...props
}: EdgeGroupingProps<ED, ND>) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useEffect(() => {
    const newTransformation = ogma.transformations.addEdgeGrouping(props);
    setTransformation(newTransformation);
    if (transformationRef) transformationRef(newTransformation);
    return () => {
      if (transformation) transformation.destroy();
    };
  }, []);

  return null;
}

interface NodeCollapsingProps<ND, ED>
  extends NodeCollapsingOptions<ND, ED>,
    WithTrandformationRef<ND, ED> {}

export function NodeCollapsing<ND = any, ED = any>({
  transformationRef,
  ...props
}: NodeCollapsingProps<ND, ED>) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useEffect(() => {
    const newTransformation = ogma.transformations.addNodeCollapsing(props);
    setTransformation(newTransformation);
    if (transformationRef) transformationRef(newTransformation);
    return () => {
      if (transformation) transformation.destroy();
    };
  }, []);

  return null;
}

interface NeighborGenerationProps<ND, ED>
  extends NeighborGenerationOptions<ND, ED>,
    WithTrandformationRef<ND, ED> {}

export function NeighborGeneration<ND = any, ED = any>({
  transformationRef,
  ...props
}: NeighborGenerationProps<ND, ED>) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useEffect(() => {
    const newTransformation = ogma.transformations.addNeighborGeneration(props);
    setTransformation(newTransformation);
    if (transformationRef) transformationRef(newTransformation);
    return () => {
      if (transformation) transformation.destroy();
    };
  }, []);

  return null;
}

interface NeighborMergingProps<ND, ED>
  extends NeighborMergingOptions<ND, ED>,
    WithTrandformationRef<ND, ED> {}

export function NeighborMerging<ND = any, ED = any>({
  transformationRef,
  ...props
}: NeighborMergingProps<ND, ED>) {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [transformation, setTransformation] = useState<Transformation>();

  useEffect(() => {
    const newTransformation = ogma.transformations.addNeighborMerging(props);
    setTransformation(newTransformation);
    if (transformationRef) transformationRef(newTransformation);
    return () => {
      if (transformation) transformation.destroy();
    };
  }, []);

  return null;
}
