import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { StoreProvider } from "easy-peasy";
import store from "./store";
import "./firebase";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
