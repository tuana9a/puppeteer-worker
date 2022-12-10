module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ["node_modules/**/*", "dist/**/*"],
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: "2021",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    indent: ["error", 2],
    quotes: [2, "double", "avoid-escape"],
    "class-methods-use-this": "off",
    radix: "off",
    "max-len": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "object-curly-newline": "off",
    "object-shorthand": "off",
    "operator-linebreak": "warn",
    "no-underscore-dangle": "off",
    "no-unused-vars": "warn",
    "import/extensions": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};
