import OgmaLib, {
  Edge,
  Node,
  Point,
  RawGraph,
  Transformation,
} from "@linkurious/ogma";
import React, { useEffect, useState, createRef } from "react";
import {
  Ogma,
  NodeStyleRule,
  EdgeStyleRule,
  Tooltip,
  NodeGrouping,
  Popup,
} from "../../src";
import { Drawer, Text, Button, Loading, Toggle } from "@geist-ui/core";
import { Menu as MenuIcon, X as XIcon } from "@geist-ui/icons";
import { LayoutService } from "./LayoutService";

export default function App() {
  const [graph, setGraph] = useState<RawGraph>();
  const [loading, setLoading] = useState(true);

  const [drawerShown, setDrawerShown] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);
  const [clickedNode, setClickedNode] = useState<Node>();

  const ref = createRef<OgmaLib>();
  const groupingRef = createRef<Transformation>();

  const [nodeGrouping, setNodeGrouping] = useState(true);

  const [tooltipPositon, setTooltipPosition] = useState<Point>({ x: 0, y: 0 });
  const [target, setTarget] = useState<Node | Edge | null>();

  useEffect(() => {
    setLoading(true);
    fetch("data.json")
      .then((res) => res.json())
      .then((data: RawGraph) => {
        setGraph(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="App">
      <Ogma
        ref={ref}
        graph={graph}
        onReady={(ogma) => {
          ogma.events
            .on("click", ({ target }) => {
              if (target && target.isNode) {
                setClickedNode(target);
                setPopupOpen(true);
              }
            })
            .on("mousemove", () => {
              const ptr = ogma.getPointerInformation();
              //setTarget(ptr.target);
              setTooltipPosition(
                ogma.view.screenToGraphCoordinates({ x: ptr.x, y: ptr.y })
              );
              setTarget(ptr.target);
            })
            // locate graph when the nodes are added
            .on("addNodes", () => ogma.view.locateGraph({ duration: 250 }));
        }}
      >
        <NodeStyleRule attributes={{ color: "#247BA0", radius: 2 }} />
        <EdgeStyleRule attributes={{ color: "#247BA0", width: 0.15 }} />
        {/* <LayoutService /> */}
        <Popup
          position={() => (clickedNode ? clickedNode.getPosition() : null)}
          onClose={() => setPopupOpen(false)}
          isOpen={clickedNode && popupOpen}
        >
          {clickedNode && (
            <div className="content">{`Node ${clickedNode.getId()}:`}</div>
          )}
        </Popup>
        <Tooltip visible={!!target} placement="top" position={tooltipPositon}>
          <div className="x">
            {target
              ? `${target.isNode ? "Node" : "Edge"} #${target.getId()}`
              : "nothing"}
          </div>
        </Tooltip>
        <NodeGrouping
          ref={groupingRef}
          disabled={!nodeGrouping}
          groupIdFunction={(node) => {
            const id = Number(node.getId());
            return id === 1 || id === 2 ? "grouped" : undefined;
          }}
          duration={1000}
        />
      </Ogma>
      <div className="controls">
        <Button
          onClick={() => setDrawerShown(!drawerShown)}
          icon={<MenuIcon />}
          w="28px"
          h="28px"
          px={0.5}
          title="Show controls"
          auto
        />
      </div>
      <Drawer
        visible={drawerShown}
        onClose={() => setDrawerShown(false)}
        placement="right"
      >
        <Drawer.Title>
          <Text>Controls</Text>
          <Button
            onClick={() => setDrawerShown(!drawerShown)}
            icon={<XIcon />}
            auto
            type="abort"
            px={0.5}
          />
        </Drawer.Title>
        <Drawer.Subtitle>This is a drawer</Drawer.Subtitle>
        <Drawer.Content>
          <div>
            <Toggle
              checked={nodeGrouping}
              onChange={() => setNodeGrouping(!nodeGrouping)}
            />
            <span>Node grouping.</span>
          </div>
        </Drawer.Content>
      </Drawer>
    </div>
  );
}
