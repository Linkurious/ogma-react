import OgmaLib, {
    StyleClassDefinition,
    StyleClass
} from "@linkurious/ogma";
import { useOgma } from "../context";
import { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";

interface StyleProps<ED, ND> extends StyleClassDefinition<ED, ND> {
    name: string;
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
    const hasRun = useRef(0);

    useImperativeHandle(ref, () => styleClass as StyleClass<ED, ND>, [styleClass]);
    
    useEffect(() => {
        // Letting react execute the useEffect twice in development will throw
        // an error in Ogma
        if (process.env.NODE_ENV === "development" && hasRun.current === 1) {
            hasRun.current++;
            return;
        }
        hasRun.current++;
        
        const style = {
            edgeAttributes,
            edgeDependencies,
            edgeOutput,
            nodeAttributes,
            nodeDependencies,
            nodeOutput
        };
        let c;
        if (styleClass?.getName() === name) {
            // Replace the style class somehow?
            return;
            // c = styleClass.update(style);
        } else {
            c = ogma.styles.createClass({ name, ...style});
        } 
        setStyleClass(c);
        return () => {
            console.log("unmount");
            if (styleClass) {
                styleClass.destroy().then();
                setStyleClass(undefined);
            }
        };
    }, [name, edgeAttributes, edgeDependencies, edgeOutput, nodeAttributes, nodeDependencies, nodeOutput]);
    return null;
};

/**
 * This component wraps around Ogma [`StyleClass`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-styles-addClassStyle) API. It allows you to add a class style to the
 * Ogma instance to calculate the visual appearance attributes of the nodes and edges.
 */
export const ClassRule = forwardRef(classStyle);