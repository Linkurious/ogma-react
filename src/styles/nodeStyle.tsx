import OgmaLib, {
  NodeSelector,
  NodeAttributesValue,
  StyleRule,
  HoverNodeOptions
} from "@linkurious/ogma";
import {
  useEffect,
  Ref,
  forwardRef,
  useState,
  useImperativeHandle
} from "react";
import { useOgma } from "../context";

interface NodeRuleProps<ND, ED> {
  selector?: NodeSelector<ND, ED>;
  attributes: NodeAttributesValue<ND, ED>;
}

interface HoveredNodeProps<ND, ED> {
  attributes: HoverNodeOptions<ND, ED>;
  fullOverwrite?: boolean;
}

interface SelectedNodeProps<ND, ED> {
  attributes: NodeAttributesValue<ND, ED>;
  fullOverwrite?: boolean;
}

const NodeStyleComponent = forwardRef(<ND, ED>(
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
});

const Hovered = <ND, ED>(
  { attributes, fullOverwrite }: HoveredNodeProps<ND, ED>,
) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;

  useEffect(() => {
    ogma.styles.setHoveredNodeAttributes(attributes, fullOverwrite);
  }, [attributes, fullOverwrite]);
  return null;
};

const Selected = <ND, ED>(
  { attributes, fullOverwrite }: SelectedNodeProps<ND, ED>,
) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;

  useEffect(() => {
    ogma.styles.setSelectedNodeAttributes(attributes, fullOverwrite);
  }, [attributes, fullOverwrite]);
  return null;
}

/**
 * This component wraps around Ogma [`NodeStyle` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-styles-addNodeRule). It allows you to add a node style rule to the
 * Ogma instance to calculate the visual appearance attributes of the nodes.
 */
export const NodeStyle = Object.assign(
  NodeStyleComponent, { Hovered, Selected }
);
