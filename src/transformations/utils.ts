import Ogma, { Transformation } from "@linkurious/ogma";
import { TransformationProps, TransformationContext } from "./types";
export function toggle<ND, ED, O extends TransformationContext>(
  transformation: Transformation<ND, ED, O>,
  disabled: boolean,
  duration?: number
) {
  if (disabled === transformation.isEnabled()) {
    if (disabled) transformation.disable(duration as number);
    else transformation.enable(duration as number);
  }
}

export function useTransformationCallbacks<
  ND,
  ED,
  C extends TransformationContext,
>(
  props: TransformationProps<ND, ED, C>,
  transformation: Transformation<ND, ED, C>,
  ogma: Ogma<ND, ED>
) {
  const enabledListener = ({
    target,
  }: {
    target: Transformation<ND, ED, C>;
  }) => {
    if (target !== transformation) return;
    props.onEnabled && props.onEnabled(transformation);
  };
  const disabledListener = ({
    target,
  }: {
    target: Transformation<ND, ED, C>;
  }) => {
    if (target !== transformation) return;
    props.onDisabled && props.onDisabled(transformation);
  };
  const updatedListener = ({
    target,
  }: {
    target: Transformation<ND, ED, C>;
  }) => {
    if (target !== transformation) return;
    props.onUpdated && props.onUpdated(transformation);
  };
  const setIndexListener = ({
    target,
    index,
  }: {
    target: Transformation<ND, ED, C>;
    index: number;
  }) => {
    if (target !== transformation) return;
    props.onSetIndex && props.onSetIndex(transformation, index);
  };
  const destroyedListener = ({
    target,
  }: {
    target: Transformation<ND, ED, C>;
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
    // @ts-expect-error TODO: expose that in Ogma
    .on("transformationEnabled", enabledListener)
    // @ts-expect-error TODO: expose that in Ogma
    .on("transformationDisabled", disabledListener)
    // @ts-expect-error TODO: expose that in Ogma
    .on("transformationDestroyed", destroyedListener)
    // @ts-expect-error TODO: expose that in Ogma
    .on("transformationSetIndex", setIndexListener)
    // @ts-expect-error TODO: expose that in Ogma
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
