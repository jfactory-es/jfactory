const chai = require("chai");
const spies = require("chai-spies");

chai.use(spies);

if (typeof COMPILER_WEBPACK === "undefined") {
  global.JFACTORY_ENV_LOG = false;
  require("./mocks/mock-httpRequests");
  require("./mocks/polyfill-DOM");
  require("./mocks/polyfill-fetch");
  // require("./mocks/polyfill-ECMAScript");
  // require("./mocks/polyfill-AbortController");
}

if (process.env.NODE_ENV === "development") {
  // global.StackTrace = require("stacktrace-js");
}

module.exports = {
  expect: chai.expect,
  chai,
  wait: (t, value) => new Promise(resolve => setTimeout(() => resolve(value), t))
};