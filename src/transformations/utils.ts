import { Ogma, Transformation } from "@linkurious/ogma";
import { AnimationProps, TransformationProps } from "./types";

type EnableArg = Parameters<Transformation<unknown, unknown>["enable"]>[0];

/**
 * Ogma 6 takes `animate: boolean`, Ogma 5 takes `duration: number`.
 * Accept both props and translate to what the installed Ogma expects.
 */
export function animationArg<ND, ED>(
  ogma: Ogma<ND, ED>,
  { animate, duration }: AnimationProps
) {
  const arg =
    parseInt(ogma.build.version, 10) >= 6
      ? (animate ?? (duration === undefined ? undefined : duration > 0))
      : (duration ?? (animate === false ? 0 : undefined));
  // the parameter type differs between Ogma 5 (number) and 6 (boolean)
  return arg as EnableArg;
}

export function toggle<ND, ED>(
  ogma: Ogma<ND, ED>,
  transformation: Transformation<ND, ED>,
  disabled: boolean,
  props: AnimationProps
) {
  if (disabled === transformation.isEnabled()) {
    const arg = animationArg(ogma, props);
    if (disabled) transformation.disable(arg);
    else transformation.enable(arg);
  }
}

export function useTransformationCallbacks<ND, ED>(
  props: TransformationProps<ND, ED>,
  transformation: Transformation<ND, ED>,
  ogma: Ogma<ND, ED>
) {
  const enabledListener = ({ target }: { target: Transformation<ND, ED> }) => {
    if (target !== transformation) return;
    if (props.onEnabled) props.onEnabled(transformation);
  };
  const disabledListener = ({ target }: { target: Transformation<ND, ED> }) => {
    if (target !== transformation) return;
    if (props.onDisabled) props.onDisabled(transformation);
  };
  const updatedListener = ({ target }: { target: Transformation<ND, ED> }) => {
    if (target !== transformation) return;
    if (props.onUpdated) props.onUpdated(transformation);
  };
  const setIndexListener = ({
    target,
    index
  }: {
    target: Transformation<ND, ED>;
    index: number;
  }) => {
    if (target !== transformation) return;
    if (props.onSetIndex) props.onSetIndex(transformation, index);
  };
  const destroyedListener = ({
    target
  }: {
    target: Transformation<ND, ED>;
  }) => {
    if (target !== transformation) return;
    if (props.onDestroyed) props.onDestroyed(transformation);
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
