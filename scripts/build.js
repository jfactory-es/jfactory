require("./env").initEnv();
if (require.main === module) {
  if (process.env.WATCH) {
    require("./bundler/bundler").watch(true);
  } else {
    require("./bundler/bundler").build();
  }
} else {
  module.exports = require("./bundler/bundler")
}