import { NodeList } from "@linkurious/ogma";
import { useEffect } from "react";
import { useOgma } from "../../src";

// custom layout service based on the event of the nodes being added
export function LayoutService() {
  const ogma = useOgma();
  const onNodesAdded = ({ nodes }: { nodes: NodeList }) => {
    console.log("nodes added", nodes.getId());
    ogma.layouts.force({ locate: true });
  };

  useEffect(() => {
    // register listener
    ogma.events.on("addNodes", onNodesAdded);
    // run it for the first time
    onNodesAdded({ nodes: ogma.getNodes() });

    // cleanup
    return () => {
      ogma.events.off(onNodesAdded);
    };
  }, [ogma]);

  return null;
}
