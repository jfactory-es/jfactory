const { getEnv } = require("../env");
const RollupCfgMaker = require("./RollupCfgMaker")
const pkg = require("../../package.json");

module.exports = new RollupCfgMaker({
  filename: "jFactory",
  version: pkg.version,
  license: "http://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt",
  repo: "http://github.com/jfactory-es/jfactory",
  bundle: getEnv("BUNDLE"),
  debug: getEnv("DEBUG"),
  sourcemap: true
}).get();