import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Custom rule overrides
  {
    rules: {
      // Allow unescaped quotes in JSX content text
      "react/no-unescaped-entities": "off",
      // Allow setState in effects (needed for some auth patterns)
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
