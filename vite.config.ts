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
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/lib/index.ts"),
      },
      name: "react-visual-querybuilder",
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
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "JSXRuntime",
        },
        assetFileNames: (assertInfo) => {
          if (assertInfo.name && assertInfo.name.endsWith(".css"))
            return "style.css";
          return assertInfo.name || "assets/[name][extname]";
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
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
