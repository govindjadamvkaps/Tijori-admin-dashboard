"use client";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

// Singleton store & persistor initialization
const store = makeStore();
const persistor = persistStore(store);
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </>
  );
}