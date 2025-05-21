import OgmaLib, {
    EdgeAttributesValue,
    EdgeDependencies,
    EdgeOutput,
    NodeAttributesValue,
    NodeOutput,
    StyleClass
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { forwardRef, Ref, useEffect, useImperativeHandle, useState } from "react";

interface StyleProps<ED, ND> {
    name: string;
    edgeAttributes?: EdgeAttributesValue<ND, ED>;
    edgeDependencies?: EdgeDependencies;
    edgeOutput?: EdgeOutput;
    nodeAttributes?: NodeAttributesValue<ED, ND>;
    nodeDependencies?: EdgeDependencies;
    nodeOutput?: NodeOutput;
}

const classStyle = <ED, ND>(
    {
        name,
        edgeAttributes,
        edgeDependencies,
        edgeOutput,
        nodeAttributes,
        nodeDependencies,
        nodeOutput,
    }: StyleProps<ED, ND>,
    ref?: Ref<StyleClass<ED, ND>>
) => {
    const ogma = useOgma() as OgmaLib<ED, ND>;
    const [styleClass, setStyleClass] = useState<StyleClass<ED, ND>>();

    useImperativeHandle(ref, () => styleClass as StyleClass<ED, ND>, [styleClass]);
    
    useEffect(() => {
        const style = {
            name,
            edgeAttributes,
            edgeDependencies,
            edgeOutput,
            nodeAttributes,
            nodeDependencies,
            nodeOutput
        };
        const c = ogma.styles.createClass(style);
        setStyleClass(c);
        return () => {
            c.destroy();
        };
    }, [name, edgeAttributes, edgeDependencies, edgeOutput, nodeAttributes, nodeDependencies, nodeOutput]);
    return null;
};

/**
 * This component wraps around Ogma [`ClassStyle`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-styles-addClassStyle) API. It allows you to add a class style to the
 * Ogma instance to calculate the visual appearance attributes of the nodes and edges.
 */
export const ClassStyle = forwardRef(classStyle);