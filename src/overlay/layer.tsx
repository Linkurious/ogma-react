import React, { FC, useEffect } from "react";
import { useOgma } from "../context";

export interface LayerProps {
  id?: string;
}

export const Layer: FC<LayerProps> = ({ children }) => {
  const ogma = useOgma();
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
