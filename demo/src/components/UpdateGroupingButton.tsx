import { FC, useCallback } from "react";
import { Layer, NodeGroupingProps } from "../../../src";
import "./UpdateGroupingButton.css";
import { ShuffleIcon } from "./ShuffleIcon";

type ND = { categories: string[] };
type ED = {};

export const UpdateGroupingButton: FC<{
  options: NodeGroupingProps<ND, ED>;
  update: (options: NodeGroupingProps<ND, ED>) => void;
}> = ({ options, update }) => {
  const onClick = useCallback(() => {
    update({
      ...options,
      groupIdFunction: (node) => {
        const categories = node.getData("categories");
        return categories[0] === "INVESTOR" ? "INVESTOR" : "OTHER";
      },
    });
  }, [options]);

  return (
    <Layer className="grouping-controls">
      <button onClick={onClick}>
        <ShuffleIcon width={18} height={18} />
      </button>
    </Layer>
  );
};
