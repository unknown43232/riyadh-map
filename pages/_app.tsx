import "@/styles/globals.css";

import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  if (typeof window !== "undefined") {
    require("leaflet/dist/leaflet.css");
  }

  return <Component {...pageProps} />;
}

export default App;
