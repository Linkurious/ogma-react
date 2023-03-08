import { Transformation } from "@linkurious/ogma";

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