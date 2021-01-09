const Mocha = require("mocha");
const mocha = new Mocha();

(async function() {
  await require("./build").build();

  mocha.addFile(process.argv[2]);
  mocha.run(function(failures) {
    process.exit(failures ? 1 : 0) // exit with non-zero status if there were failures
  });
})()