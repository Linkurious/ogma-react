#!/usr/bin/env node

const fs = require("fs/promises");

fs.readFile("package.json", "utf8")
  .then((data) => {
    const base = JSON.parse(data);
    const overwrite = {
      devDependencies: undefined,
      scripts: undefined,
      eslintConfig: undefined,
      browserslist: undefined,
      jest: undefined,
      "jest-junit": undefined,
      peerDependencies: base.peerDependencies,
      private: undefined,
      files: base.files.map((f) => f.replace("dist/", "")),
    };
    ["jsdelivr", "browser", "main", "module", "typings"].forEach((field) => {
      overwrite[field] = base[field].replace("dist/", "");
    });
    return { ...base, ...overwrite };
  })
  .then((data) =>
    fs.writeFile("dist/package.json", JSON.stringify(data, null, 2))
  );
