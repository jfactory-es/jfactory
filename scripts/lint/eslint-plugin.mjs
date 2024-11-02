import { default as originalSemiRule } from '@stylistic/eslint-plugin-js/rules/semi';

const jFactoryESLintPlugIn = {
  meta: {
    name: 'jFactoryESLintPlugIn',
    version: '0.9.0'
  },
  rules: {
    'semi-FORK:optional-semi-before-parens-braces': {
      meta: originalSemiRule.meta,
      create(context) {
        function check(node) {
          const sourceCode = context.getSourceCode();
          const lastToken = sourceCode.getLastToken(node);
          const nextToken = sourceCode.getTokenAfter(lastToken);
          if (nextToken && (nextToken.value === ')' || nextToken.value === '}')) {
            // if (lastToken && lastToken.value === ';') {
            //   context.report({
            //     node: lastToken,
            //     message: 'Unnecessary semicolon.',
            //     fix(fixer) {
            //       return fixer.remove(lastToken)
            //     }
            //   })
            // }
          } else {
            const originalRule = originalSemiRule.create(context);
            if (originalRule[node.type]) {
              originalRule[node.type](node)
            }
          }
        }

        return {
          // VariableDeclaration: check,
          ExpressionStatement: check,
          // ReturnStatement: check,
          // ThrowStatement: check,
          // DoWhileStatement: check,
          // DebuggerStatement: check,
          // BreakStatement: check,
          // ContinueStatement: check
          // ImportDeclaration: check,
          // ExportAllDeclaration: check,
          // ExportNamedDeclaration: check,
          // ExportDefaultDeclaration: check,
          PropertyDefinition: check
        }
      }
    }
  }
};

export default jFactoryESLintPlugIn;