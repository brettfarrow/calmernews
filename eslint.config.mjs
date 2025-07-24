import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["*.css", ".next/**", "out/**", "node_modules/**"],
  },
  ...compat.extends("next/core-web-vitals", "prettier"),
  {
    plugins: {
      prettier: (await import("eslint-plugin-prettier")).default,
      "react-19-upgrade": (await import("eslint-plugin-react-19-upgrade")).default,
    },
    rules: {
      "react-19-upgrade/no-default-props": "error",
      "react-19-upgrade/no-prop-types": "warn",
      "react-19-upgrade/no-legacy-context": "error",
      "react-19-upgrade/no-string-refs": "error",
      "react-19-upgrade/no-factories": "error",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;