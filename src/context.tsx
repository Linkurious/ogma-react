import { createContext, useContext, Context } from "react";
import OgmaLib from "@linkurious/ogma";

export function createOgmaContext<ND = unknown, ED = unknown>() {
  return createContext<{ ogma?: OgmaLib<ND, ED> } | null>(null);
}

export const OgmaContext = createContext(undefined) as Context<
  OgmaLib | undefined
>;

export const useOgma = <ND, ED>(): OgmaLib<ND, ED> => {
  const ogma = useContext(OgmaContext);
  if (!ogma) throw new Error("useOgma must be used within an OgmaProvider");
  return ogma;
};
