import { useCallback, useEffect } from "react";
import { useOgma } from "../../../src";

// custom layout service based on the event of the nodes being added
export function LayoutService() {
  const ogma = useOgma();
  const onNodesAdded = useCallback(() => {
    ogma.events.once("idle", () => {
      ogma.getNodes().setAttributes({ x: 0, y: 0 });
      ogma.layouts.force({ locate: true });
    });
  }, [ogma]);

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
