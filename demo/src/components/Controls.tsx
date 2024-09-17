import { useState } from "react";
import {
  Drawer,
  Text,
  Title,
  Switch as Toggle,
  Slider,
  ActionIcon,
  Space,
} from "@mantine/core";
import { Menu as MenuIcon } from "react-feather";

interface ControlsProps {
  toggleNodeGrouping: (value: boolean) => void;
  nodeGrouping: boolean;
  setNodeSize: (value: number) => void;
  setEdgeWidth: (value: number) => void;
  outlines: boolean;
  setOutlines: (value: boolean) => void;
  geoEnabled: boolean;
  setGeoEnabled: (value: boolean) => void;
}

export function Controls({
  toggleNodeGrouping,
  nodeGrouping,
  setNodeSize,
  setEdgeWidth,
  geoEnabled,
  setGeoEnabled,
  outlines,
  setOutlines,
}: ControlsProps) {
  //const ogma = useOgma();
  const [drawerShown, setDrawerShown] = useState(false);
  const [nodeSize, setNodeSizeLocal] = useState(5);
  const [edgeWidth, setEdgeWidthLocal] = useState(0.25);
  return (
    <>
      <div className="control-buttons">
        {!drawerShown && (
          <ActionIcon
            onClick={() => setDrawerShown(!drawerShown)}
            w="28px"
            h="28px"
            px={0.5}
            title="Show controls"
            variant="outline"
          >
            <MenuIcon />
          </ActionIcon>
        )}
      </div>
      <Drawer
        opened={drawerShown}
        onClose={() => setDrawerShown(false)}
        position="right"
        className="controls"
      >
        <Title order={2}>Controls</Title>
        <Space h="xl" />
        {/* <Button
            onClick={() => setDrawerShown(!drawerShown)}
            icon={<XIcon />}
            auto
            variant="outline"
            px={0.5}
          /> */}
        <div className="controls-section">
          <Toggle
            checked={nodeGrouping}
            onChange={() => toggleNodeGrouping(!nodeGrouping)}
            label="Node grouping"
          />
        </div>
        <div className="controls-section">
          <Text>Node size</Text>
          <Slider
            value={nodeSize}
            max={50}
            min={1}
            step={0.25}
            onClickCapture={(evt) => evt.stopPropagation()}
            onChange={(value) => {
              setNodeSize(value);
              setNodeSizeLocal(value);
            }}
            label="Node size"
          />
        </div>
        <Space />
        <div className="controls-section">
          <Text>Edge width</Text>
          <Slider
            value={edgeWidth}
            max={5}
            min={0.05}
            step={0.25}
            onClickCapture={(evt) => evt.stopPropagation()}
            onChange={(value) => {
              setEdgeWidth(value);
              setEdgeWidthLocal(value);
            }}
          />
        </div>
        <div className="controls-section">
          <Toggle
            checked={outlines}
            onChange={() => setOutlines(!outlines)}
            label="Node outlines"
          />
        </div>
        <div className="controls-section">
          <Toggle
            checked={geoEnabled}
            onChange={() => setGeoEnabled(!geoEnabled)}
            label="Geo mode"
          />
        </div>
      </Drawer>
    </>
  );
}
