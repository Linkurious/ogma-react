import { EventTypes } from "@linkurious/ogma";

export type EventNames<ND, ED> = keyof EventTypes<ND, ED>;

export type EventHandlers<ND, ED> = {
  [K in EventNames<ND, ED>]?: (event: EventTypes<ND, ED>[K]) => void;
};

// Generate component props from EventTypes
export type EventHandlerProps<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]?: (event: T[K]) => void;
};

// Type-safe function to iterate through event handlers
export function forEachEventHandler<ND, ED>(
  handlers: EventHandlers<ND, ED>,
  callback: <K extends EventNames<ND, ED>>(
    eventName: K,
    handler: (event: EventTypes<ND, ED>[K]) => void
  ) => void
) {
  // Type-safe iteration
  (Object.keys(handlers) as EventNames<ND, ED>[]).forEach((eventName) => {
    const handler = handlers[eventName];
    // @ts-expect-error type union
    if (handler) callback(eventName, handler);
  });
}

// Helper to convert onEventName to eventname
export function getEventNameFromProp<ND, ED>(propName: string) {
  if (propName.startsWith("on") && propName.length > 2) {
    // remove 'on' and convert first letter to lowercase
    const eventName = propName[2].toLowerCase() + propName.substring(3);
    return eventName as EventNames<ND, ED>;
  }
  return null;
}
