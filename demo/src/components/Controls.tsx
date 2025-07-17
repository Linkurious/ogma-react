import { useState } from "react";
import { Drawer } from "./Drawer";
import { Toggle } from "./Toggle";
import { Slider } from "./Slider";
import { Menu as MenuIcon } from "react-feather";
import "./Controls.css";

interface ControlsProps {
  toggleNodeGrouping: (value: boolean) => void;
  nodeGrouping: boolean;
  setNodeSize: (value: number) => void;
  setEdgeWidth: (value: number) => void;
  outlines: boolean;
  setOutlines: (value: boolean) => void;
  geoEnabled: boolean;
  setGeoEnabled: (value: boolean) => void;
  addNode: () => void;
  useClass: boolean;
  setUseClass: (value: boolean) => void;
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
  addNode,
  useClass,
  setUseClass
}: ControlsProps) {
  //const ogma = useOgma();
  const [drawerShown, setDrawerShown] = useState(false);
  const [nodeSize, setNodeSizeLocal] = useState(5);
  const [edgeWidth, setEdgeWidthLocal] = useState(0.25);
  return (
    <>
      <div className="control-buttons">
        {!drawerShown && (
          <button
            onClick={() => setDrawerShown(!drawerShown)}
            title="Show controls"
          >
            <MenuIcon width={18} />
          </button>
        )}
      </div>
      <Drawer
        isOpen={drawerShown}
        onClosed={() => setDrawerShown(false)}
        className="controls"
      >
        <h2>Controls</h2>
        <div className="controls-section">
          <Toggle
            checked={nodeGrouping}
            label="Node grouping"
            onChange={() => toggleNodeGrouping(!nodeGrouping)}
          />
        </div>
        <div className="controls-section">
          <h3>Node size</h3>
          <Slider
            value={nodeSize}
            max={50}
            min={1}
            step={0.25}
            onChange={(value) => {
              setNodeSize(value);
              setNodeSizeLocal(value);
            }}
          />
        </div>
        <div className="controls-section">
          <h3>Edge width</h3>
          <Slider
            value={edgeWidth}
            max={5}
            min={0.05}
            step={0.25}
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
        <div className="controls-section">
          <div className="link-button" onClick={() => addNode()}>
            Add node
          </div>
        </div>
        <div className="controls-section">
          <Toggle
            checked={useClass}
            onChange={setUseClass}
            label="Use class"
          />
        </div>
      </Drawer>
    </>
  );
}
