import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import couponReducer from "./coupunSlice";
import authReducer from "./authSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["coupon", "auth"], // Persist both coupon and auth states
};

// Combine reducers
const rootReducer = combineReducers({
  coupon: couponReducer,
  auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Ignore serialization errors
    }),
});

// ✅ Export store & persistor properly
const persistor = persistStore(store);

export { store, persistor };
