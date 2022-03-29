import { createContext, useContext, Context } from "react";
import Ogma from "@linkurious/ogma";

export function createOgmaContext<ND = unknown, ED = unknown>() {
  return createContext<{ ogma?: Ogma<ND, ED> } | null>(null);
}

export const OgmaContext = createContext(undefined) as Context<
  Ogma | undefined
>;

export const useOgma = <ND, ED>(): Ogma<ND, ED> => {
  const ogma = useContext(OgmaContext);
  if (!ogma) throw new Error("useOgma must be used within an OgmaProvider");
  return ogma;
};
