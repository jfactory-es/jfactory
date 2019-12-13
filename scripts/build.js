/* jFactory Build, Copyright (c) 2019, Stéphane Plazis,
   https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt */

require("./env").initEnv();
if (require.main === module) {
  require("./bundler/bundler").build()
} else {
  module.exports = require("./bundler/bundler").build();
}