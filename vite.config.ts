import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src/lib/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/examples/**/*"],
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.app.json')
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.ts"),
      },
      name: "react-querybuilder-lite",
      formats: ["es", "cjs"],
      fileName: (format: string, entryName: string) => {
        if (format === "es") return `${entryName}.js`;
        return `${entryName}.cjs`;
      },
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
      ],
      output: {
        assetFileNames: (assertInfo) => {
          if (assertInfo.name && assertInfo.name.endsWith(".css"))
            return "style.css";
          return assertInfo.name || "assets/[name][extname]";
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
});
