import {defineConfig} from "tsup";

export default defineConfig((options) => ({
  entry: ["./index.ts"],
  outDir: "./example/dist",
  bundle: true,
  platform: "browser",
  noExternal: [ /(.*)/ ],
}))