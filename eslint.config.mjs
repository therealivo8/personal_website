import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

// PRD 09 §2.1 — a11y violations must fail the lint step rather than warn.
// eslint-config-next already registers the jsx-a11y plugin, so the strict
// preset can't be spread in (it would redefine the plugin); take its rules
// and force them all to "error" instead.
const a11yRules = Object.fromEntries(
  Object.keys(jsxA11y.flatConfigs.strict.rules ?? {}).map((rule) => [rule, "error"]),
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: a11yRules },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
