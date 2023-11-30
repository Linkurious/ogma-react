import React from "react";
import { createRoot } from "react-dom/client";
import "./src/index.css";
import App from "./src/App";
import { GeistProvider, CssBaseline } from "@geist-ui/core";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GeistProvider>
      <CssBaseline />
      <App />
    </GeistProvider>
  </React.StrictMode>
);
