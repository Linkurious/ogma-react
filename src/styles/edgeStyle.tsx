import OgmaLib, {
  EdgeSelector,
  EdgeAttributesValue,
  StyleRule,
  HoverEdgeOptions
} from "@linkurious/ogma";
import {
  useEffect,
  useState,
  Ref,
  forwardRef,
  useImperativeHandle
} from "react";
import { useOgma } from "../context";

interface EdgeRuleProps<ND, ED> {
  selector?: EdgeSelector<ED, ND>;
  attributes: EdgeAttributesValue<ED, ND>;
}

interface HoveredEdgeProps<ND, ED> {
  attributes: HoverEdgeOptions<ED, ND>;
  fullOverwrite?: boolean;
}

interface SelectedEdgeProps<ND, ED> {
  attributes: EdgeAttributesValue<ED, ND>;
  fullOverwrite?: boolean;
}


const EdgeStyleComponent = forwardRef(<ND, ED>(
  { selector, attributes }: EdgeRuleProps<ND, ED>,
  ref?: Ref<StyleRule<ND, ED>>
) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;
  const [rule, setRule] = useState<StyleRule<ND, ED>>();

  useImperativeHandle(ref, () => rule as StyleRule<ND, ED>, [rule]);

  useEffect(() => {
    //if (rule) rule.destroy();
    const edgeRule = selector
      ? ogma.styles.addEdgeRule(selector, attributes)
      : ogma.styles.addEdgeRule(attributes);
    setRule(edgeRule);
    return () => {
      edgeRule.destroy();
      setRule(undefined);
    };
  }, [selector, attributes]);
  return null;
});

const Hovered = <ND, ED>(
  { attributes, fullOverwrite }: HoveredEdgeProps<ND, ED>,
) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;

  useEffect(() => {
    ogma.styles.setHoveredEdgeAttributes(attributes, fullOverwrite);

    return () => {
      ogma.styles.setHoveredEdgeAttributes(null);
    }
  }, [attributes, fullOverwrite]);
  return null;
}

const Selected = <ND, ED>(
  { attributes, fullOverwrite }: SelectedEdgeProps<ND, ED>,
) => {
  const ogma = useOgma() as OgmaLib<ND, ED>;

  useEffect(() => {
    ogma.styles.setSelectedEdgeAttributes(attributes, fullOverwrite);

    return () => {
      ogma.styles.setSelectedEdgeAttributes(null);
    };
  }, [attributes, fullOverwrite]);
  return null;
};

/**
 * This component wraps around Ogma [`EdgeStyle` API](https://doc.linkurio.us/ogma/latest/api.html#Ogma-styles-addEdgeRule). It allows you to add a node style rule to the
 * Ogma instance to calculate the visual appearance attributes of the edges.
 */
export const EdgeStyle = Object.assign(
  EdgeStyleComponent, { Hovered, Selected }
);
