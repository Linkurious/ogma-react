import React, { useState } from "react";
import { Drawer, Text, Button, Toggle, Slider, Spacer } from "@geist-ui/core";
import { Menu as MenuIcon, X as XIcon } from "@geist-ui/icons";

interface ControlsProps {
  toggleNodeGrouping: (value: boolean) => void;
  nodeGrouping: boolean;
  setNodeSize: (value: number) => void;
  setEdgeWidth: (value: number) => void;
}

export function Controls({
  toggleNodeGrouping,
  nodeGrouping,
  setNodeSize,
  setEdgeWidth,
}: ControlsProps) {
  //const ogma = useOgma();
  const [drawerShown, setDrawerShown] = useState(false);
  return (
    <>
      <div className="control-buttons">
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
        className="controls"
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
        <Drawer.Content>
          <div className="controls-section">
            <Toggle
              checked={nodeGrouping}
              onChange={() => toggleNodeGrouping(!nodeGrouping)}
            />
            <span className="controls-section-label">Node grouping</span>
          </div>
          <Spacer h={1} />
          <div className="controls-section">
            <Text>Node size</Text>
            <Slider
              initialValue={5}
              max={50}
              min={1}
              step={0.25}
              onClickCapture={(evt) => evt.stopPropagation()}
              onChange={setNodeSize}
            />
          </div>
          <Spacer h={1} />
          <div className="controls-section">
            <Text>Edge width</Text>
            <Slider
              initialValue={0.25}
              max={5}
              min={0.05}
              step={0.5}
              onClickCapture={(evt) => evt.stopPropagation()}
              onChange={setEdgeWidth}
            />
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  );
}
