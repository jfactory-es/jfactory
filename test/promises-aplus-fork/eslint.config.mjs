export default [
  {
    languageOptions: {
      ecmaVersion: 2021
    },
    rules: {
      // "camelcase": ["error", { "properties": "always" }],
      // "curly": ["error", "all"],
      // "eqeqeq": ["error", "always"],
      // "strict": ["error", "global"],
      // "no-extra-bind": "error", // Correspond à JSLint `immed`
      // "indent": ["error", 2],
      // "max-len": ["error", { "code": 120 }],
      // "new-cap": ["error"],
      // "no-caller": "error", // remplace noarg de JSLint
      // "no-new": "error",
      // "no-underscore-dangle": ["error", { "allowAfterThis": false }],
      // "quotes": ["error", "double"],
      // "no-trailing-spaces": "error",
      // "no-undef": "error",
      // "no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
      // "space-before-blocks": ["error", "always"],
      // "space-before-function-paren": ["error", "never"],
      // "keyword-spacing": ["error", { "before": true, "after": true }],
      // "space-infix-ops": "error"
    }
  },
  {
    files: ["**/lib/*.*js"],
    rules: {
      "indent": ["error", 4]
    }
  },
  {
    files: ["**/*.test.*js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        afterEach: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        it: "readonly",
        specify: "readonly"
      }
    },
    rules: {
      "indent": ["error", 4]
    }
  }
]