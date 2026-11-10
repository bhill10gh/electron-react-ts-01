import { defineConfig } from "vite";

const watchDenylist = [
  "**/backend/**",
  "**/.vs/**",
  "**/dist/**",
  "**/out/**",
  "**/publish/**",
];

// https://vitejs.dev/config
export default defineConfig({
  server: {
    watch: {
      ignored: watchDenylist,
    },
  },
  build: {
    watch: {
      include: ["src/main.ts", "src/**/*.ts"],
      exclude: watchDenylist,
    },
  },
});
