import { Transformation } from "@linkurious/ogma";

export interface TransformationContext {}
export interface AnimationProps {
  /** Ogma 6+ */
  animate?: boolean;
  /** @deprecated Ogma 5 only, use `animate` with Ogma 6 */
  duration?: number;
}

/** TODO: expose that in Ogma */
export interface TransformationOptions extends AnimationProps {
  enabled?: boolean;
}

export interface TransformationProps<
  ND,
  ED,
  C extends TransformationContext = TransformationContext
> extends AnimationProps {
  disabled?: boolean;
  onEnabled?: (transformation: Transformation<ND, ED, C>) => void;
  onDisabled?: (transformation: Transformation<ND, ED, C>) => void;
  onDestroyed?: (transformation: Transformation<ND, ED, C>) => void;
  onUpdated?: (transformation: Transformation<ND, ED, C>) => void;
  onSetIndex?: (
    transformation: Transformation<ND, ED, C>,
    index: number
  ) => void;
}
