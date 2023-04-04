import { defineConfig } from "vite";

const config = defineConfig({
  build: {
    lib: {
      entry: ["src/index.node.ts", "src/index.browser.ts"],
      formats: ["es"],
    },
  },
});

export default config;
