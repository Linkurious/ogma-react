import Ogma, { Transformation } from "@linkurious/ogma";
import { TransformationProps, TransformationOptions } from "./types";

export function toggle<ND, ED, O extends TransformationOptions>(
  transformation: Transformation<ND, ED, O>,
  disabled: boolean,
  duration?: number,
) {
  if (disabled === transformation.isEnabled()) {
    if (disabled) transformation.disable(duration as number);
    else transformation.enable(duration as number);
  }
}

export function useTransformationCallbacks<
  ND,
  ED,
  O extends TransformationOptions,
>(
  props: TransformationProps<ND, ED, O>,
  transformation: Transformation<ND, ED, O>,
  ogma: Ogma,
) {
  const enabledListener = ({
    target,
  }: {
    target: Transformation<ND, ED, O>;
  }) => {
    if (target !== transformation) return;
    props.onEnabled && props.onEnabled(transformation);
  };
  const disabledListener = ({
    target,
  }: {
    target: Transformation<ND, ED, O>;
  }) => {
    if (target !== transformation) return;
    props.onDisabled && props.onDisabled(transformation);
  };
  const updatedListener = ({
    target,
  }: {
    target: Transformation<ND, ED, O>;
  }) => {
    if (target !== transformation) return;
    props.onUpdated && props.onUpdated(transformation);
  };
  const setIndexListener = ({
    target,
    index,
  }: {
    target: Transformation<ND, ED, O>;
    index: number;
  }) => {
    if (target !== transformation) return;
    props.onSetIndex && props.onSetIndex(transformation, index);
  };
  const destroyedListener = ({
    target,
  }: {
    target: Transformation<ND, ED, O>;
  }) => {
    if (target !== transformation) return;
    props.onDestroyed && props.onDestroyed(transformation);
    ogma.events
      .off(enabledListener)
      .off(disabledListener)
      .off(updatedListener)
      .off(setIndexListener)
      .off(destroyedListener);
  };
  ogma.events
    .on("transformationEnabled", enabledListener)
    .on("transformationDisabled", disabledListener)
    .on("transformationDestroyed", destroyedListener)
    .on("transformationSetIndex", setIndexListener)
    .on("transformationRefresh", updatedListener);
  const cleanup = () => {
    ogma.events
      .off(enabledListener)
      .off(disabledListener)
      .off(updatedListener)
      .off(setIndexListener)
      .off(destroyedListener);
  };
  return cleanup;
}
