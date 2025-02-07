// filepath: /Users/hectoraltamira/summarist-intern-project/redux/store.ts
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import modalSlice from "./modalReducer";
import userSlice from "./userReducer";
import subscriptionSlice from "./subscriptionReducer"; // Import the new subscription slice

// Create a noop storage for environments where localStorage is not available
const createNoopStorage = () => {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
};

// Use web storage if available, otherwise fallback to noop storage
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers if you have more than one
const rootReducer = {
  modals: modalSlice,
  user: persistReducer(persistConfig, userSlice),
  subscription: subscriptionSlice, // Add the new subscription slice to the root reducer
};

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Create the persistor
const persistor: Persistor = persistStore(store, null, () => {
  // Check if the state is null or undefined
  const state = store.getState();
  if (state === null || state === undefined) {
    console.error('Persisted state is null or undefined');
  }
});

export { store, persistor };






