import Ogma, { Transformation } from "@linkurious/ogma";
import { TransformationProps } from "./types";

export function toggle(
  transformation: Transformation,
  disabled: boolean,
  duration?: number
) {
  if (disabled === transformation.isEnabled()) {
    if (disabled) transformation.disable(duration as number);
    else transformation.enable(duration as number);
  }
}

export function useTransformationCallbacks(props: TransformationProps, transformation: Transformation, ogma: Ogma) {
  const enabledListener = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onEnabled && props.onEnabled(transformation);
  };
  const disabledListener = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onDisabled && props.onDisabled(transformation);
  };
  const updatedListener = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onUpdated && props.onUpdated(transformation);
  };
  const destroyedListener = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onDestroyed && props.onDestroyed(transformation);
    ogma.events.off(enabledListener)
      .off(disabledListener)
      .off(updatedListener)
      .off(destroyedListener);

  };
  ogma.events.on('transformationEnabled', enabledListener)
    .on('transformationDisabled', disabledListener)
    .on('transformationDestroyed', destroyedListener)
    .on('transformationRefresh', updatedListener);
  const cleanup = () => {
    ogma.events.off(enabledListener)
      .off(disabledListener)
      .off(updatedListener)
      .off(destroyedListener);
  };
  return cleanup;
}