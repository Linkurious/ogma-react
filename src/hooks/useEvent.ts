import { EventTypes } from "@linkurious/ogma";
import { useCallback } from "react";
import { EventNames } from "../types";

export function useEvent<
  ND = unknown,
  ED = unknown,
  K extends EventNames<ND, ED> = EventNames<ND, ED>
  // @ts-expect-error evtName is used to infer the type of the event
>(eventName: K, handler: (event: EventTypes<ND, ED>[K]) => void) {
  const callback = useCallback(handler, []);

  return callback;
}
