import { builtinModules } from "node:module";
import nodeExternals from "webpack-node-externals";

// what we have to do is to essentially tell Webpack to actually use ESM format as well as standard ESM loading mechanism. We need to change our target from node20 to esX like ES2020, ES2022, etc. But changing the target to something other than node means we have to manually feed Webpack information about what built-in modules should be excluded as those can be assumed to be provided by runtime.

export default {
  // note: changing the target to eg. "node" doesn't change anything about the error
  target: "es2022",
  externals: [
    // note: if you were to uncomment this (aka NOT bundling in Jimp), it will work. But I need to bundle it in for my electron usecase.
    // nodeExternals({ importType: "module" }),
    /^node:/,
    ...builtinModules,
  ],
  // note: externalsPresets: { node: true } has no additional effect
  entry: {
    main: "./main.js",
  },
  output: {
    path: process.cwd(),
    filename: "[name].bundle.dev.js",
    // note: using or not using these doesn't change anything about the error
    // libraryTarget: "module",
    // library: {
    //   type: "module",
    // },
    chunkFormat: "module",
    module: true,
    // note: chunkLoading: "import", iife: false with optimization: runtimeChunk: true yields the same error
  },
  // note: resolve: conditionNames: ["import", "node"] or similar doesn't change anything about the error
  experiments: {
    // to enable esm output
    outputModule: true,
  },
};
