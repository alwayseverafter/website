import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    /**
     * The parallel agent worktrees under .claude/ hold full copies of this
     * tree, so without this every suite runs twice and a failure is reported
     * against a path nobody edits.
     */
    exclude: ["node_modules/**", ".next/**", ".claude/**"],
  },
});
