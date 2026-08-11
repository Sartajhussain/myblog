import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/ThemeProvider";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import axios from "axios";
import { API_BASE_URL } from "./utils/api";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL;

const persistor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  </Provider>
);

// ✅ Remove the initial HTML loader only after the browser has actually
// painted the React content — not just after render() was called.
function removeInitialLoader() {
  const initialLoader = document.getElementById("initial-loader");
  if (!initialLoader) return;

  initialLoader.classList.add("fade-out");
  setTimeout(() => initialLoader.remove(), 400);
}

// requestAnimationFrame twice = wait for the browser's next paint cycle,
// which means React has actually committed and drawn something.
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    removeInitialLoader();
  });
});

// Safety net: if something is still slow (images, fonts, etc.),
// force-remove the loader once everything has fully loaded.
window.addEventListener("load", removeInitialLoader);