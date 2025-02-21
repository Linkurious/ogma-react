import Ogma, { Transformation } from "@linkurious/ogma";
import { TransformationProps } from "./types";

export function toggle<ND, ED>(
  transformation: Transformation<ND, ED>,
  disabled: boolean,
  duration?: number
) {
  if (disabled === transformation.isEnabled()) {
    if (disabled) transformation.disable(duration as number);
    else transformation.enable(duration as number);
  }
}

export function useTransformationCallbacks<ND, ED>(
  props: TransformationProps<ND, ED>,
  transformation: Transformation<ND, ED>,
  ogma: Ogma<ND, ED>
) {
  const enabledListener = ({ target }: { target: Transformation<ND, ED> }) => {
    if (target !== transformation) return;
    props.onEnabled && props.onEnabled(transformation);
  };
  const disabledListener = ({ target }: { target: Transformation<ND, ED> }) => {
    if (target !== transformation) return;
    props.onDisabled && props.onDisabled(transformation);
  };
  const updatedListener = ({ target }: { target: Transformation<ND, ED> }) => {
    if (target !== transformation) return;
    props.onUpdated && props.onUpdated(transformation);
  };
  const setIndexListener = ({
    target,
    index
  }: {
    target: Transformation<ND, ED>;
    index: number;
  }) => {
    if (target !== transformation) return;
    props.onSetIndex && props.onSetIndex(transformation, index);
  };
  const destroyedListener = ({
    target
  }: {
    target: Transformation<ND, ED>;
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
