let prepare = require("mocha-prepare"); // fix https://github.com/mochajs/mocha/issues/1810

prepare(async function(done) {
  await require("../build");
  done()
});