import { createContext, useContext } from "react";
import OgmaLib from "@linkurious/ogma";

type ContextData<ND, ED> = {
  ogma: OgmaLib<ND, ED>;
}

export const OgmaContext = createContext<ContextData<any, any> | null>(null);
/**
 * This is the hook that allows you to access the Ogma instance.
 * It should only be used in the context of the `Ogma` component.
 */
export const useOgma = <ND, ED>(): OgmaLib<ND, ED> => {
  const context = useContext(OgmaContext) as ContextData<ND, ED> | null;
  if (!context) throw new Error("useOgma must be used within an OgmaProvider");
  return context.ogma;
};

