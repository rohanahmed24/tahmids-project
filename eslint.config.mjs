import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "eslint-config-next";

const eslintConfig = defineConfig([
  ...nextPlugin,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    ".netlify/**",
    "next-env.d.ts",
    "scripts/**",
    "prisma/*.js",
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
