const jsdom = require("jsdom");

console.warn('testsuite: using "jsdom" to polyfill DOM & Web APIs');
global.window = new jsdom.JSDOM(
  '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    "</body></html>", {
    url: "http://localhost",
    resources: "usable"
  }).window;

/* global window */
global.document = window.document;

Object.getOwnPropertyNames(window).forEach(key => {
  let k = key[0];
  if (k !== "_" && !global[key] && k === k.toUpperCase()) {
    global[key] = window[key]
  }
});