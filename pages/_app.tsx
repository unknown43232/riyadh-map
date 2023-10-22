import React, { useEffect } from "react"; // <-- Add this import
import "@/styles/globals.css";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Dynamically import the Leaflet CSS on the client side
    import("leaflet/dist/leaflet.css");
  }, []);

  return <Component {...pageProps} />;
}
