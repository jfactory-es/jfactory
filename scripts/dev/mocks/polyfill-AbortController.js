if (!global.AbortController) {
  console.warn('testsuite: using "abortcontroller-polyfill" to polyfill AbortController');
  require("abortcontroller-polyfill/dist/polyfill-patch-fetch");
}