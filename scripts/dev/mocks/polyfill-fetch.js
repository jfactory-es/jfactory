if (!global.fetch) {
  console.warn('testsuite: using "node-fetch" to polyfill fetch, Request, Response');
  let _fetch = require("node-fetch");
  global.fetch = function fetch(url, ...args) {
    if (typeof url === "string") {
      return _fetch("http://localhost/" + url, ...args)
    } else
    {
      return _fetch(...arguments)
    }
  };
  let _Request = _fetch.Request;
  global.Request = function(url, ...arg) {
    return new _Request("http://localhost/" + url, ...arg)
  };

  global.Response = _fetch.Response;
}