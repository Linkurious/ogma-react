import { Transformation } from "@linkurious/ogma";

/** TODO: expose that in Ogma */
export interface TransformationOptions {
  duration?: number;
  enabled?: boolean;
}

export interface TransformationProps<
  ND,
  ED,
  O extends TransformationOptions = TransformationOptions,
> {
  disabled?: boolean;
  onEnabled?: (transformation: Transformation<ND, ED, O>) => void;
  onDisabled?: (transformation: Transformation<ND, ED, O>) => void;
  onDestroyed?: (transformation: Transformation<ND, ED, O>) => void;
  onUpdated?: (transformation: Transformation<ND, ED, O>) => void;
  onSetIndex?: (
    transformation: Transformation<ND, ED, O>,
    index: number,
  ) => void;
}
