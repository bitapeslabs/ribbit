import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/ui/assets/fonts/poppins.css";
import "@/ui/assets/fonts/ubuntu.css";
import "@/ui/assets/fonts/sedgwick.css";
import Providers from "@/ui/providers";

import { Router } from "@/ui/pages";

import "@/ui/index.css";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <StrictMode>
      <Router />
    </StrictMode>
  </Providers>
);
