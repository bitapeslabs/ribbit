import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/fonts/poppins.css";
import "./assets/fonts/ubuntu.css";
import { Router } from "@/ui/pages";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
