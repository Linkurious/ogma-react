#!/usr/bin/env node

const esbuild = require("esbuild");
const globalName = "OgmaReact";

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/server": "ReactDOMServer",
  "@linkurious/ogma": "Ogma",
};

const banner = `
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const mapping = ${JSON.stringify(globals)};
    global.${globalName} = factory((name) => global[mapping[name]]);
  }
}(this, (function (require) { 'use strict';
`;
const footer = `
  return ${globalName};
})));
`;

function build() {
  return esbuild.build({
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/index.umd.js",
    allowOverwrite: true,
    external: Object.keys(globals),
    color: true,
    banner: { js: banner },
    footer: { js: footer },
    target: "es2016",
    sourcemap: true,
    globalName,
    legalComments: "inline",
    format: "iife",
    bundle: true,
    logLevel: "info",
    minify: true,
  });
}

build();
