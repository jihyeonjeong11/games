import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/main.ts",
  output: {
    file: "public/bundle.js",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    livereload(),
    typescript(),
    production && terser(), // minify, but only in production
  ],
};
