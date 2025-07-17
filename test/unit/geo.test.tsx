import OgmaLib from "@linkurious/ogma";
import { Ogma } from "../../src";
import { createRef } from "react";
import { Geo } from "../../src";
import { render } from "./utils";

import * as L from "leaflet";
OgmaLib.libraries["leaflet"] = L;

describe("Geo Mode", () => {
  it("enables geo mode when enabled prop is true", () => {
    const ref = createRef<OgmaLib>();
    render(
      <Ogma ref={ref}>
        <Geo enabled />
      </Ogma>
    );
    expect(ref.current?.geo.enabled()).toBe(true);
  });
});