import React, { createContext, Context, FC } from "react";
import Ogma from "@linkurious/ogma";

export const OgmaContext = createContext(undefined) as Context<
  Ogma | undefined
>;

interface OutputProps {
  ogma: Ogma;
}

export interface InputProps {}

export function withOgma<T>(Component: FC<Omit<T, "ogma"> & OutputProps>) {
  const WrappedComponent: FC<Omit<T, "ogma"> & InputProps> = (props) => {
    return (
      <OgmaContext.Consumer>
        {(ogma) => ogma && <Component {...props} ogma={ogma} />}
      </OgmaContext.Consumer>
    );
  };

  return WrappedComponent;
}
