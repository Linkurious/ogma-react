import React, { createContext, useContext, Context, FC } from "react";
import Ogma from "@linkurious/ogma";

export function createOgmaContext<ND = unknown, ED = unknown>() {
  return createContext<{ ogma?: Ogma<ND, ED> } | null>(null);
}

export const OgmaContext = createContext(undefined) as Context<
  Ogma | undefined
>;

interface OutputProps<ND, ED> {
  ogma: Ogma<ND, ED>;
}

export interface InputProps {}

export function withOgma<T, ND = unknown, ED = unknown>(
  Component: FC<Omit<T, "ogma"> & OutputProps<ND, ED>>
) {
  const WrappedComponent: FC<Omit<T, "ogma"> & InputProps> = (props) => {
    return (
      <OgmaContext.Consumer>
        {(ogma) => ogma && <Component {...props} ogma={ogma} />}
      </OgmaContext.Consumer>
    );
  };

  return WrappedComponent;
}

export const useOgma = <ND, ED>(): Ogma<ND, ED> => {
  const ogma = useContext(OgmaContext);
  if (!ogma) throw new Error("useOgma must be used within an OgmaProvider");
  return ogma;
};
