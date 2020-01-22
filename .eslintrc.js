module.exports = {

  extends: [
    "eslint:recommended"
  ],
  ignorePatterns: [
    "/*",
    "**/_*",
    "**/*fork",
    "!scripts/",
    "!src/",
    "!test/**",
    "!.eslintrc.js"
  ],
  env: {
    es6: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "max-len": ["error", 120],
    "eol-last": ["error", "never"],
    quotes: ["error", "double", { avoidEscape: true }],
    "arrow-parens": ["error", "as-needed"],
    "quote-props": ["error", "as-needed"],
    "comma-dangle": ["error", "never"],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "space-unary-ops": ["error", { words: false }],
    "space-infix-ops": "error",
    "object-curly-spacing": ["error", "always", {
      // arraysInObjects: false
    }],
    "no-extra-parens": ["error", "all", {
      conditionalAssign: false
    }],
    "comma-spacing": ["error", { before: false, after: true }],
    "arrow-spacing": "error",
    "func-call-spacing": "error",
    "key-spacing": ["error", { afterColon: true }],
    "keyword-spacing": ["error", { before: true }],
    "space-before-function-paren": ["error", {
      anonymous: "never",
      named: "never",
      asyncArrow: "always"
    }]
  },

  overrides: [

    {
      files: ["*.js"],
      env: { node: true },
      rules: {
        indent: [
          2, 2, {
            SwitchCase: 1
          }],
        "no-prototype-builtins": "off"
      }
    },

    {
      files: ["src/*.mjs"],
      env: {
        browser: true
      },
      rules: {
        indent: [
          2, 4, {
            SwitchCase: 1
          }]
      },
      globals: {
        globalThis: "readonly", // not yet supported
        process: "readonly", // only process is required
        COMPILER_DEV: "readonly",
        COMPILER_DEBUG: "readonly",
        COMPILER_CLI: "readonly",
        jFactoryOverride: "readonly",
        StackTrace: "readonly"
      }
    },

    {
      files: ["test/*.test.js"],
      env: {
        browser: true,
        mocha: true
      },
      rules: {
        indent: [
          2, 4
        ],
        "require-atomic-updates": "off"
      }
    }

  ]
};