// console.warn('testsuite: using "core-js@3" to polyfill ECMAScript');
// require("@babel/register")({
//     compact: false,
//     presets: [
//         ['@babel/preset-env', {
//             useBuiltIns: 'usage',
//             corejs: {version: 3, proposals: true},
//             targets: {
//                 "node": process.version
//             },
//             shippedProposals: true
//         }]
//     ]
// })

if (!global.globalThis) {
  console.warn('testsuite: using "global" to polyfill globalThis');
  global.globalThis = global;
}