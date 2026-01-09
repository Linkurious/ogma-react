import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactElement,
  type Ref,
  type RefAttributes
} from "react";
import { useOgma } from "../context";
// import { useTransformationCallbacks } from "./utils";
import type { TransformationProps } from "./types";

// Helper types to extract the correct types from Ogma's addDrillDown method
type OgmaInstance<ND, ED> = ReturnType<typeof useOgma<ND, ED>>;
type AddDrillDownFn<ND, ED> = OgmaInstance<
  ND,
  ED
>["transformations"]["addDrillDown"];

export type Drilldown<ND, ED> = ReturnType<AddDrillDownFn<ND, ED>>;
export type DrilldownOptions<ND, ED> = NonNullable<
  Parameters<OmitThisParameter<AddDrillDownFn<ND, ED>>>[0]
>;

interface NodeDrilldownPropsBase<ND, ED>
  extends
    DrilldownOptions<ND, ED>,
    TransformationProps<ND, ED, DrilldownOptions<ND, ED>> {}

/**
 * Public props: we intentionally hide `enabled` and expose `disabled` (from TransformationProps).
 */
export type NodeDrilldownProps<ND, ED> = Omit<
  NodeDrilldownPropsBase<ND, ED>,
  "enabled"
>;

function NodeDrilldownComponent<ND = unknown, ED = unknown>(
  props: NodeDrilldownProps<ND, ED>,
  ref: Ref<Drilldown<ND, ED> | null>
) {
  const ogma = useOgma<ND, ED>();

  const [transformation, setTransformation] = useState<Drilldown<
    ND,
    ED
  > | null>(null);

  // Expose the transformation instance (or null while mounting/unmounted)
  useImperativeHandle(ref, () => transformation!, [transformation]);

  useEffect(() => {
    const newTransformation = ogma.transformations.addDrillDown({
      ...props,
      enabled: !props.disabled
    });
    // transformations callbacks are tricky (drilldown: set of transformations?)
    setTransformation(newTransformation);
    return () => {
      newTransformation.destroy();
      setTransformation(null);
    };
  }, [props.disabled]);

  useEffect(() => {
    if (transformation) {
      // toggle(transformation, !!props.disabled, props.duration);
      const disabled = !!props.disabled;
      const duration = props.duration;
      // also, `.isEnabled` does not exist on drilldown transformation
      // if (disabled === transformation.isEnabled()) {
      if (disabled) transformation.disable(duration as number);
      else transformation.enable(duration as number);
      // }
    }
  }, [props.disabled, props.duration]);

  useEffect(() => {
    transformation?.setOptions(props);
  }, [
    props.copyData,
    props.depthPath,
    props.duration,
    props.easing,
    props.nodeGenerator,
    props.onDestroyed,
    props.onDisabled,
    props.onEnabled,
    props.onGetSubgraph,
    props.onGroupUpdate,
    props.onSetIndex,
    props.onUpdated,
    props.padding,
    props.parentPath,
    props.showContents
  ]);

  return null;
}

export type NodeDrilldownComponentType = <ND = unknown, ED = unknown>(
  props: NodeDrilldownProps<ND, ED> & RefAttributes<Drilldown<ND, ED> | null>
) => ReactElement | null;

export const NodeDrilldown = forwardRef(
  NodeDrilldownComponent
) as NodeDrilldownComponentType;
