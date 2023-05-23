import Ogma, { Transformation } from "@linkurious/ogma";
import { TransformationProps } from "./types";
import { useEffect } from "react";

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
  const enabledListenner = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onEnabled && props.onEnabled(transformation);
  };
  const disabledListenner = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onDisabled && props.onDisabled(transformation);
  };
  const updatedListenner = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onUpdated && props.onUpdated(transformation);
  };
  const destroyedListenner = ({ target }: { target: Transformation }) => {
    if (target !== transformation) return;
    props.onDestroyed && props.onDestroyed(transformation);
    ogma.events.off(enabledListenner);
    ogma.events.off(disabledListenner);
    ogma.events.off(updatedListenner);
    ogma.events.off(destroyedListenner);

  };
  ogma.events.on('transformationEnabled', enabledListenner);
  ogma.events.on('transformationDisabled', disabledListenner);
  ogma.events.on('transformationDestroyed', destroyedListenner);
  ogma.events.on('transformationRefresh', updatedListenner);
  const cleanup = () => {
    ogma.events.off(enabledListenner);
    ogma.events.off(disabledListenner);
    ogma.events.off(updatedListenner);
    ogma.events.off(destroyedListenner);
  };
  return cleanup;
}