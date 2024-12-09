import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import inject from "@rollup/plugin-inject";

export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths(),
        nodePolyfills({
            include: ["buffer"], // Ensures 'buffer' polyfill is included
            globals: {
                Buffer: true, // Inject Buffer as a global
            },
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            plugins: [
                inject({
                    // Ensures Buffer is available as globalThis.Buffer
                    "globalThis.Buffer": ["buffer", "Buffer"],
                }),
            ],
            input: {
                main: resolve(__dirname, "index.html"),
                background: resolve(__dirname, "src/background/index.ts"),
                ui: resolve(__dirname, "src/ui/index.tsx"),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === "background") return "background.js";
                    if (chunkInfo.name === "ui") return "ui.js";
                    return "assets/[name].[hash].js";
                },
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith(".css")) return "ui.css";
                    return "assets/[name].[hash].[ext]";
                },
            },
        },
        outDir: "dist",
        assetsDir: "assets",
    },
    publicDir: "public",
});
