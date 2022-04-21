#!/usr/bin/env node

const esbuild = require("esbuild");
const globalName = "OgmaReact";

const banner = `
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    const mapping = { 'react': 'React', 'react-dom': 'ReactDom', '@linkurious/ogma': 'Ogma' };
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
    external: ["@linkurious/ogma", "react", "react-dom"],
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
