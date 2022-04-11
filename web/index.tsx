import React from "react";
import ReactDOM from "react-dom";
import "./src/index.css";
import App from "./src/App";
import { GeistProvider, CssBaseline } from "@geist-ui/core";

ReactDOM.render(
  <React.StrictMode>
    <GeistProvider>
      <CssBaseline />
      <App />
    </GeistProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
