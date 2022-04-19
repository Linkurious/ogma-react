import { createContext, useContext, Context } from "react";
import OgmaLib from "@linkurious/ogma";

export function createOgmaContext<ND = unknown, ED = unknown>() {
  return createContext<{ ogma?: OgmaLib<ND, ED> } | null>(null);
}

export const OgmaContext = createContext(undefined) as Context<
  OgmaLib | undefined
>;

/**
 * This is the hook that allows you to access the Ogma instance.
 * It should only be used in the context of the `Ogma` component.
 */
export const useOgma = <ND, ED>(): OgmaLib<ND, ED> => {
  const ogma = useContext(OgmaContext);
  if (!ogma) throw new Error("useOgma must be used within an OgmaProvider");
  return ogma;
};
