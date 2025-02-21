import { Transformation } from "@linkurious/ogma";

export interface TransformationContext {}
/** TODO: expose that in Ogma */
export interface TransformationOptions {
  duration?: number;
  enabled?: boolean;
}

export interface TransformationProps<
  ND,
  ED,
  C extends TransformationContext = TransformationContext
> {
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
