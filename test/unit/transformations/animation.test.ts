import { describe, expect, it } from "vitest";
import { Ogma } from "@linkurious/ogma";
import {
  animationArg,
  withAnimation
} from "../../../src/transformations/utils";

const ogma = (version: string) =>
  ({ build: { version } }) as unknown as Ogma<unknown, unknown>;
const v5 = ogma("5.3.11");
const v6 = ogma("6.0.6");

describe("animationArg", () => {
  it("Ogma 6 prefers animate, falls back to duration > 0", () => {
    expect(animationArg(v6, { animate: false })).toBe(false);
    expect(animationArg(v6, { duration: 0 })).toBe(false);
    expect(animationArg(v6, { duration: 300 })).toBe(true);
    expect(animationArg(v6, { animate: false, duration: 300 })).toBe(false);
    expect(animationArg(v6, {})).toBeUndefined();
  });

  it("Ogma 5 prefers duration, falls back to animate={false} -> 0", () => {
    expect(animationArg(v5, { duration: 300 })).toBe(300);
    expect(animationArg(v5, { animate: false })).toBe(0);
    expect(animationArg(v5, { animate: true })).toBeUndefined();
    expect(animationArg(v5, { animate: false, duration: 300 })).toBe(300);
    expect(animationArg(v5, {})).toBeUndefined();
  });
});

describe("withAnimation", () => {
  it("emits only the option the installed Ogma understands", () => {
    expect(withAnimation(v6, { duration: 0, a: 1 })).toEqual({
      animate: false,
      a: 1
    });
    expect(withAnimation(v5, { animate: false, a: 1 })).toEqual({
      duration: 0,
      a: 1
    });
  });

  it("strips both keys when neither is set", () => {
    expect(withAnimation(v6, { a: 1 })).toEqual({ a: 1 });
    expect(withAnimation(v5, { animate: true, a: 1 })).toEqual({ a: 1 });
  });
});
