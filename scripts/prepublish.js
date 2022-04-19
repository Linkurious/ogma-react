#!/usr/bin/env node

const fs = require("fs");

fs.readFile("package.json", "utf8", (err, data) => {
  if (err) throw err;
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
    main: "lib.umd.js",
  };
  ["main", "module", "typings"].forEach((field) => {
    overwrite[field] = base[field].replace("dist/", "");
  });
  fs.writeFile(
    "./dist/package.json",
    JSON.stringify({ ...base, ...overwrite }, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
});
