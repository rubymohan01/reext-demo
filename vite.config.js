import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import reext from "./node_modules/@sencha/reext/dist/ReExt/vite-plugin-reext.js";

export default defineConfig({
  plugins: [react(), reext()],
  resolve: {
    alias: {
      "@sencha/reext": "/node_modules/@sencha/reext",
      // Add any other aliases if necessary
    },
  },
});
