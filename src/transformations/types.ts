import { Transformation } from "@linkurious/ogma";



export interface TransformationProps {
  disabled?: boolean;
  onEnabled?: (transformation: Transformation) => void;
  onDisabled?: (transformation: Transformation) => void;
  onDestroyed?: (transformation: Transformation) => void;
  onUpdated?: (transformation: Transformation) => void;
  onSetIndex?: (transformation: Transformation, index: number) => void;
}
