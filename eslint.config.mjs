import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    languageOptions: {
      ecmaVersion: 'latest'
    },
    rules: {
      'require-atomic-updates': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': ['error', { caughtErrors: 'none' }],
      'no-useless-catch': 'error',
      'no-catch-shadow': 'error',
      'no-unsafe-finally': 'error',
      'no-await-in-loop': 'error',
      'no-return-await': 'error',
      'no-promise-executor-return': 'error',
      'no-misleading-character-class': 'error',
      'consistent-return': 'error',
      'no-duplicate-imports': 'error',
      'no-self-assign': 'error',
      'no-constructor-return': 'error',
      'eqeqeq': ['error', 'always'],
      'no-implicit-globals': 'error',
      '@stylistic/js/max-len': ['error', { code: 120 }],
      '@stylistic/js/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/js/no-multiple-empty-lines': ['error', { max: 2 }],
      '@stylistic/js/eol-last': ['error', 'never'],
      '@stylistic/js/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/js/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/js/arrow-parens': ['error', 'as-needed'],
      '@stylistic/js/no-extra-parens': ['error', 'all', { conditionalAssign: false }],
      '@stylistic/js/comma-dangle': ['error', 'never'],
      '@stylistic/js/key-spacing': ['error', { afterColon: true }],
      '@stylistic/js/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/js/object-curly-spacing': ['error', 'always', { objectsInObjects: false, arraysInObjects: false }],
      '@stylistic/js/array-bracket-spacing': ['error', 'never', { objectsInArrays: false, arraysInArrays: false }],
      '@stylistic/js/arrow-spacing': 'error',
      '@stylistic/js/function-call-spacing': ['error', 'never'],
      '@stylistic/js/keyword-spacing': ['error', {
        overrides: {
          // while: { after: false },
        }
      }],
      '@stylistic/js/space-infix-ops': 'error',
      '@stylistic/js/space-unary-ops': [
        2, {
          words: true,
          nonwords: false,
          overrides: {
            // 'new': false,
            // '++': true
          }
        }
      ],
      '@stylistic/js/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],
      '@stylistic/js/semi': ['warn', 'always', {
        omitLastInOneLineBlock: true,
        omitLastInOneLineClassBody: true
      }],
      '@stylistic/js/semi-style': ['error', 'last'],
      '@stylistic/js/semi-spacing': 'error',
      '@stylistic/js/no-extra-semi': 'error'
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node
      }
    },
    rules: {
    }
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
    }
  },
  {
    files: ['src/**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
        process: 'readonly'
      }
    },
    rules: {
      '@stylistic/js/indent': ['error', 4, { SwitchCase: 1 }],
      '@stylistic/js/quotes': ['error', 'double', { avoidEscape: true }]
    }
  },
  {
    files: ['test/**/*.*js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    rules: {
      '@stylistic/js/indent': ['error', 4, { SwitchCase: 1 }],
      '@stylistic/js/quotes': ['error', 'double', { avoidEscape: true }]
    }
  }
];