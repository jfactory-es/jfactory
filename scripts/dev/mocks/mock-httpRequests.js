const fs = require("fs");
const path = require("path");
const nock = require("nock");

console.warn('testsuite: using "nock" to mock http://localhost');
const root = path.normalize(__dirname + "/../serverRoot");
nock("http://localhost")
  .persist()
  .get((/*uri*/) => true)
  .reply(201, (uri, requestBody, cb) => {
    fs.readFile(root + path.normalize(uri), cb)
  });