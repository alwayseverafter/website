import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/* The same "@/" the app builds with, so a route can be imported in a test. */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    /**
     * The parallel agent worktrees under .claude/ hold full copies of this
     * tree, so without this every suite runs twice and a failure is reported
     * against a path nobody edits.
     */
    exclude: ["node_modules/**", ".next/**", ".claude/**"],
  },
});
