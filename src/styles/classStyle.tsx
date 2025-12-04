import {
  StyleClassDefinition,
  StyleClass as OgmaStyleClass
} from "@linkurious/ogma";
import { useOgma } from "../context";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
  memo
} from "react";

interface StyleProps<ND, ED> extends StyleClassDefinition<ND, ED> {
  name: string;
}

const styleClassComponent = <ND, ED>(
  {
    name,
    edgeAttributes,
    edgeDependencies,
    edgeOutput,
    nodeAttributes,
    nodeDependencies,
    nodeOutput
  }: StyleProps<ND, ED>,
  ref?: Ref<OgmaStyleClass<ND, ED>>
) => {
  const ogma = useOgma<ND, ED>();
  const [styleClass, setStyleClass] = useState<OgmaStyleClass<ND, ED> | null>(
    null
  );

  useImperativeHandle(ref, () => styleClass as OgmaStyleClass<ND, ED>, [
    styleClass
  ]);

  useEffect(() => {
    const style = {
      edgeAttributes,
      edgeDependencies,
      edgeOutput,
      nodeAttributes,
      nodeDependencies,
      nodeOutput
    };

    async function setup() {
      const newStyleClass = ogma.styles.createClass({ name, ...style });
      await ogma.view.afterNextFrame();
      setStyleClass(newStyleClass);
    }
    setup();

    return () => {
      async function cleanup() {
        // Only destroy if we have a reference and it still exists
        const currentClass = ogma.styles.getClass(name);
        if (currentClass) await currentClass.destroy();
        setStyleClass(null);
      }
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!styleClass) return;
    console.log("Updating style class", name);
    styleClass.update({
      edgeAttributes,
      edgeDependencies,
      edgeOutput,
      nodeAttributes,
      nodeDependencies,
      nodeOutput
    });
  }, [
    edgeAttributes,
    edgeDependencies,
    edgeOutput,
    nodeAttributes,
    nodeDependencies,
    nodeOutput
  ]);

  return null;
};

const arePropsEqual = <ND, ED>(
  prev: StyleProps<ND, ED>,
  next: StyleProps<ND, ED>
) => {
  return (
    prev.name === next.name &&
    prev.edgeAttributes === next.edgeAttributes &&
    prev.edgeDependencies === next.edgeDependencies &&
    prev.edgeOutput === next.edgeOutput &&
    prev.nodeAttributes === next.nodeAttributes &&
    prev.nodeDependencies === next.nodeDependencies &&
    prev.nodeOutput === next.nodeOutput
  );
};

/**
 * This component wraps around Ogma [`StyleClass`](https://doc.linkurio.us/ogma/latest/api.html#Ogma-styles-addClassStyle) API. It allows you to add a class style to the
 * Ogma instance to calculate the visual appearance attributes of the nodes and edges.
 */
export const StyleClass = memo(forwardRef(styleClassComponent), arePropsEqual);
