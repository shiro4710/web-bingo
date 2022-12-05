import type { AppProps } from "next/app";
import React from "react";
import { UserGlobalStyles } from "../styles/global";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <UserGlobalStyles />
      <Component {...pageProps} />
    </React.StrictMode>
  );
}
