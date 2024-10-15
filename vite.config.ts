import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        // Correct path to index.html without using import.meta.url
        main: resolve(__dirname, "index.html"), // This resolves index.html in the project root
        // Background script
        background: resolve(__dirname, "src/background/index.ts"),
        // UI (Main entry for the UI)
        ui: resolve(__dirname, "src/ui/index.tsx"),
      },
      output: {
        // Output JavaScript files
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "background.js"; // Output background.js
          }
          if (chunkInfo.name === "ui") {
            return "ui.js"; // Output ui.js
          }
          return "assets/[name].[hash].js"; // Default for other JS files
        },
        // Ensure CSS output is named 'ui.css' without hash
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "ui.css"; // Output all CSS files as 'ui.css'
          }
          return "assets/[name].[hash].[ext]"; // Default behavior for other assets
        },
      },
    },
    outDir: "dist", // Output directory for compiled files
    assetsDir: "assets", // Directory for other assets like images
  },
  publicDir: "public", // Directory for manifest.json and other public assets
});
