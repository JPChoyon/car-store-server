import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules", "dist"],
    rules: {
      "no-unused-expressions": "error",
      "prefer-const": "warn",
      "no-console": "warn",
      "no-undef": "error",
      "no-unused-vars": "warn",
      // " @typescript-eslint/no-unused-vars": "warn",
      // "@typescript-eslint/no-explicit-any": "warn"
    },
  },
];