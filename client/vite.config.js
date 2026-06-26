import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Blog Platform",
        short_name: "Blog App",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
          {
            src: "/big.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/small.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
