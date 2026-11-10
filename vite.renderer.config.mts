import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const watchDenylist = [
  "**/backend/**",
  "**/.vs/**",
  "**/dist/**",
  "**/out/**",
  "**/.vite/**",
  "**/publish/**",
];

// https://vitejs.dev/config
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: watchDenylist,
    },
  },
});
