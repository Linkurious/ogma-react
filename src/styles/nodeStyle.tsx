import OgmaLib, {
  NodeSelector,
  NodeAttributesValue,
  StyleRule,
} from "@linkurious/ogma";
import {
  useEffect,
  Ref,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import { useOgma } from "../context";

interface NodeRuleProps<ND, ED> {
  selector?: NodeSelector<ND, ED>;
  attributes: NodeAttributesValue<ND, ED>;
}

const NodeStyleRuleComponent = <ND, ED>(
  { selector, attributes }: NodeRuleProps<ND, ED>,
  ref?: Ref<StyleRule<ND, ED>>
) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [rule, setRule] = useState<StyleRule<ND, ED>>();

  useImperativeHandle(ref, () => rule as StyleRule<ND, ED>, [rule]);

  useEffect(() => {
    const nodeRule = selector
      ? ogma.styles.addNodeRule(selector, attributes)
      : ogma.styles.addNodeRule(attributes);
    setRule(nodeRule);
    return () => {
      nodeRule.destroy();
      setRule(undefined);
    };
  }, [selector, attributes]);
  return null;
};

export const NodeStyleRule = forwardRef(NodeStyleRuleComponent);
