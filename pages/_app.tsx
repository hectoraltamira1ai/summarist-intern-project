import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";
import { auth } from "@/firebase";
import { setUser, signOutUser } from "@/redux/userReducer";
import "@/styles/globals.css";

import { AppProps } from "next/app";

export const metadata = {
  title: "Summarist Books",
};

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        store.dispatch(setUser({ email: user.email, uid: user.uid }));
      } else {
        store.dispatch(signOutUser());
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default MyApp;