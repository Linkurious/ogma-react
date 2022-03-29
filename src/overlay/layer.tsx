import React, { FC, useEffect } from "react";
import Ogma from "@linkurious/ogma";
import { withOgma } from "../context";

export interface LayerProps {
  id?: string;
  ogma: Ogma;
}

const LayerComponent: FC<LayerProps> = ({ children }) => {
  // unmount hook
  useEffect(() => {
    // events

    return () => {
      // remove
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // add to ogma/

  return <>{children}</>;
};

export const Layer = withOgma<LayerProps>(LayerComponent);
