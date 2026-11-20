import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import React from "react";
import { Provider } from "react-redux";

import { store } from "./store/store";

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element "#root" was not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
