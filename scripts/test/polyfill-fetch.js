// Bug : vitest "environment: 'jsdom'" causes exception if Request object passed to fetch()
// Workaround: polyfill to replace Request

import fetch, { Request, Response } from "node-fetch";

console.warn('testsuite: using "node-fetch" to polyfill or replace native Request');
global.Request = Request;
// console.warn('testsuite: using "node-fetch" to polyfill or replace native Response');
// global.Response = Response;
// console.warn('testsuite: using "node-fetch" to polyfill or replace native fetch()');
// global.fetch = fetch;