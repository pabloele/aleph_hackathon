import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ThirdwebProvider } from "thirdweb/react";
import { AppProvider } from "@/contexts/AppContext";
export default function App({ Component, pageProps }) {
  return <ThirdwebProvider>
    <AppProvider>
    <Component {...pageProps} />

    </AppProvider>
  </ThirdwebProvider>;
}
