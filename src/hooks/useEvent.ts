import { EventTypes } from "@linkurious/ogma";
import { useCallback } from "react";
import { EventNames } from "../types";

export function useEvent<
  ND,
  ED,
  K extends EventNames<ND, ED>
>(
  // @ts-expect-error evtName is used to infer the type of the event
  eventName: K,
  handler: (event: EventTypes<ND, ED>[K]) => void,
  dependencies?: any[]
): (event: EventTypes<ND, ED>[K]) => void {
  const dep = dependencies ? dependencies : [];
  const callback = useCallback(handler, dep);

  return callback;
}
