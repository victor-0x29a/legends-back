import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  {languageOptions: { globals: globals.node }},
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off"
    }
  }
];
