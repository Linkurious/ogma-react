#!/usr/bin/env node

import fs from "fs/promises";

const stripDist = (value) => value.replace("./dist/", "./").replace("dist/", "");

fs.readFile("package.json", "utf8")
  .then((data) => {
    const base = JSON.parse(data);
    const overwrite = {
      devDependencies: undefined,
      scripts: undefined,
      eslintConfig: undefined,
      browserslist: undefined,
      peerDependencies: base.peerDependencies,
      private: undefined,
      files: base.files.map((f) => f.replace("dist/", "")),
      // every entry point (".", "./geo", ...) with its dist/ prefix removed
      exports: Object.fromEntries(
        Object.entries(base.exports).map(([entry, conditions]) => [
          entry,
          Object.fromEntries(
            Object.entries(conditions).map(([key, file]) => [key, stripDist(file)])
          )
        ])
      )
    };
    ["jsdelivr", "browser", "main", "module", "typings"].forEach((field) => {
      overwrite[field] = base[field].replace("dist/", "");
    });
    return { ...base, ...overwrite };
  })
  .then((data) =>
    fs.writeFile("dist/package.json", JSON.stringify(data, null, 2))
  );
