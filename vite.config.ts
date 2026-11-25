import { defineConfig } from "vite-plus";
export default defineConfig({
  fmt: {
    ignorePatterns: [
      ".ref/**",
      ".tmp/**",
      ".cache/**",
      ".pnpm-store/**",
      "lib/**",
      "node_modules/**",
    ],
  },
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  lint: {
    ignorePatterns: [".ref/**", ".cache/**", ".pnpm-store/**", "lib/**", "node_modules/**"],
    options: { typeAware: true, typeCheck: true },
  },
  pack: [
    {
      name: "host",
      entry: {
        index: "src/host/entry.ts",
        engine: "src/engine/index.ts",
        gate: "src/host/gate.ts",
        cli: "src/cli.ts",
      },
      outDir: "lib",
      format: "esm",
      platform: "node",
      target: "es2024",
      fixedExtension: false,
      clean: true,
      dts: true,
      sourcemap: true,
      deps: { neverBundle: [new RegExp("^@deepseek-ai/")] },
    },
    {
      name: "client",
      entry: { client: "src/client/index.tsx" },
      outDir: "lib",
      format: "cjs",
      platform: "browser",
      inputOptions: { platform: "browser" },
      target: "es2022",
      fixedExtension: false,
      clean: false,
      dts: false,
      deps: {
        neverBundle: [
          new RegExp("^react(?:/.*)?$"),
          new RegExp("^react-dom(?:/.*)?$"),
          new RegExp("^@deepseek-ai/dsh-client-ui-primitives$"),
        ],
      },
      define: { "process.env.NODE_ENV": '"production"' },
      outputOptions: {
        entryFileNames: "client.js",
        banner: 'window.__ModuleLoader__.load({ id: "dsh-compact-cat", factory: (require) => {',
        intro: "var module = { exports: {} }; var exports = module.exports;",
        footer: "return module.exports; } });",
      },
    },
  ],
});
