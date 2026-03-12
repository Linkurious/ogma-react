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
// TODO: Add transformation callbacks support via useTransformationCallbacks from "./utils" if needed.
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

  // Initialize the Drilldown transformation
  useEffect(() => {
    const { disabled, ...rest } = props;
    const drilldown = ogma.transformations.addDrillDown({
      ...rest,
      enabled: !disabled
    });
    // TODO: Drilldown may internally manage a set of transformations, so we currently do not
    //       wire it through generic transformation-callback helpers (e.g. useTransformationCallbacks).
    //       If/when we add React-level transformation callbacks specific to drilldown, revisit this
    //       effect to ensure callbacks are correctly registered and cleaned up.
    setTransformation(drilldown);
    return () => {
      drilldown.destroy();
      setTransformation(null);
    };
  }, []);

  // Enable/disable the transformation based on the `disabled` prop
  // Note: This useEffect is not dependent on the `duration` prop to avoid
  //       unnecessary re-enabling/disabling when only the duration changes.
  useEffect(() => {
    if (transformation) {
      const disabled = !!props.disabled;
      const duration = props.duration;
      // Note: Drilldown transformation does not expose `isEnabled()`,
      // so we rely on the `disabled` prop to decide whether to enable/disable.
      if (disabled) transformation.disable(duration as number);
      else transformation.enable(duration as number);
    }
  }, [props.disabled]);

  // Update other options when their corresponding props change
  useEffect(() => {
    // Extract the disabled prop from the rest
    // to avoid overwriting the above enable/disable logic
    const { disabled, ...rest } = props; // eslint-disable-line @typescript-eslint/no-unused-vars
    transformation?.setOptions(rest);
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
