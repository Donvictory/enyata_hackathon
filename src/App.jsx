import { router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "./Components/ui/sonner";
import { registerSW } from "virtual:pwa-register";
import { useEffect } from "react";

// Register Service Worker for PWA
registerSW({ immediate: true });

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}

export default App;
