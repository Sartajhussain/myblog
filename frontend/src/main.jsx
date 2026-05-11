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
      <ThemeProvider >
        <App />
      </ThemeProvider>
      </PersistGate>
      <Toaster position="top-center" reverseOrder={false} />
    </BrowserRouter>
  </Provider>
);
