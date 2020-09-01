/* jFactory Test, Copyright (c) 2019, Stéphane Plazis,
   https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

const Mocha = require("mocha");
const mocha = new Mocha();

(async function() {
  await require("./build").build();

  mocha.addFile(process.argv[2]);
  mocha.run(function(failures) {
    process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
  });
})()