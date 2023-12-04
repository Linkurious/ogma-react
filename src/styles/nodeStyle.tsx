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
  ref?: Ref<StyleRule<ND, ED>>,
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

/**
 * This component wraps around Ogma [`NodeStyle` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-styles-addNodeRule). It allows you to add a node style rule to the
 * Ogma instance to calculate the visual appearance attributes of the nodes.
 */
export const NodeStyleRule = forwardRef(NodeStyleRuleComponent);
