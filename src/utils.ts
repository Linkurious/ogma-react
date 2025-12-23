import Ogma, {
  EventTypes
} from "@linkurious/ogma";
import { OgmaProps } from "./ogma";
import {
  getEventNameFromProp,
  EventHandlers,
  forEachEventHandler
} from "./types";

export function handleEventProps<ND, ED>(
  ogma: Ogma<ND, ED>,
  props: any,
  previousEventHandlers: EventHandlers<ND, ED>
): void {
  // Get all current event handler props
  const currentEventHandlers: EventHandlers<ND, ED> = {};

  // Check all props for event handlers (onXxx)
  Object.keys(props).forEach((propName) => {
    if (!propName.startsWith("on")) return;
    const name = propName as keyof EventTypes<ND, ED>;
    const eventName = getEventNameFromProp<ND, ED>(name);
    const propValue = props[propName as keyof OgmaProps<ND, ED>];

    if (eventName && typeof propValue === "function") {
      // No type assertion needed, eventName is already verified
      currentEventHandlers[eventName] = propValue as (
        event: EventTypes<ND, ED>[NonNullable<typeof eventName>]
      ) => void;
    }
  });

  // Remove handlers that are no longer present
  forEachEventHandler(previousEventHandlers, (eventName, handler) => {
    if (!currentEventHandlers[eventName]) {
      // Handler was removed
      ogma.events.off(handler);
      delete previousEventHandlers[eventName];
    }
  });

  // Add new handlers
  forEachEventHandler(currentEventHandlers, (eventName, handler) => {
    const existingHandler = previousEventHandlers[eventName];

    // If handler changed, remove old one
    if (existingHandler && existingHandler !== handler) {
      ogma.events.off(existingHandler);
    }

    // If it's a new handler or changed handler, add it
    if (!existingHandler || existingHandler !== handler) {
      // console.log(555, "add handler", eventName, existingHandler === handler);
      ogma.events.on(eventName, handler);
      // @ts-expect-error type union
      previousEventHandlers[eventName] = handler;
    }
  });
}

export function isContentEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  try {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  } catch {
    return false;
  }
}