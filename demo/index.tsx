import React from "react";
import { createRoot } from "react-dom/client";
import "./src/index.css";
import App from "./src/App";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";

const container = document.getElementById("root")!;
const root = createRoot(container);

const theme = createTheme({});

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
