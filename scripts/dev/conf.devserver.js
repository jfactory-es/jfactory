const { getEnv } = require("../env");

module.exports = {

  port: 8080,
  host: "localhost",
  hot: false,

  // webpack-dev-server 3
  // --------------------

  contentBase: "scripts/dev/serverRoot",
  publicPath: "/",

  watchContentBase: true,
  inline: true,

  // Hot module is not useful here
  // Better to liveReload the page to cleanup everything
  liveReload: true,

  // caution: causes webpack compile loop
  // if syntax error in code and hot module is enabled
  writeToDisk: getEnv("DEBUG") && (filePath => {
    return filePath.endsWith("testsuite.js");
  }),

  // watchOptions: {
  //     poll: true
  // },

  overlay: {
    // warnings: true,
    errors: true
  },

  clientLogLevel: "warn",
  stats: "errors-only"
  // stats: 'verbose'

  // compress: true,
  // http2: true,
  // https: true,

  // webpack-dev-server 4
  // see node_modules/webpack-dev-server/lib/options.json
  // --------------------
  //
  // static: {
  //   directory: "scripts/dev/serverRoot"
  // },
  //
  // dev: {
  //   publicPath: "/"
  //
  //   // writeToDisk: getEnv("DEBUG") && (filePath => {
  //   //   return filePath.endsWith("testsuite.js");
  //   // }),
  // },
  //
  // client: {
  //   // logging: "error",
  // }
};