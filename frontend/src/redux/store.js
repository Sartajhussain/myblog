import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import themeSlice from "./themeSlice";
import blogSlice from "./blogSlice";
import commentReducer from "./commentSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// ===============================
// Root Reducer
// ===============================
const rootReducer = combineReducers({
  auth: authSlice,
  theme: themeSlice,
  blog: blogSlice,
  comment: commentReducer,
});

// ===============================
// Persist Config
// ===============================
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// ===============================
// Persisted Reducer
// ===============================
const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

// ===============================
// Store
// ===============================
const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// ===============================
// Persistor
// ===============================
export const persistor = persistStore(store);

export default store;