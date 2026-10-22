import { NodeList } from "@linkurious/ogma";
import { useCallback, useEffect } from "react";
import { useOgma } from "../../../src";

// custom layout service based on the event of the nodes being added
export function LayoutService() {
  const ogma = useOgma();
  const onNodesAdded = useCallback(
    (_evt: { nodes: NodeList }) => {
      ogma.events.once("idle", () => ogma.layouts.force({ locate: true }));
    },
    [ogma]
  );

  useEffect(() => {
    // register listener
    ogma.events.on(
      ["addNodes", "transformationEnabled", "transformationDisabled"],
      onNodesAdded
    );

    // cleanup
    return () => {
      ogma.events.off(onNodesAdded);
    };
  }, [ogma]);

  return null;
}
