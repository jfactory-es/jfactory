require("./env").initEnv();

const bundler = require("./bundler/bundler");
const webpack = require("webpack");
const wds = require("webpack-dev-server");

const CONF_WEBPACK = require("./dev/conf.webpack");
const CONF_SERVER = require("./dev/conf.devserver");

// bug https://github.com/webpack/watchpack/issues/25
bundler.watch()
  .then(() => {
    const server = new wds(webpack(CONF_WEBPACK), CONF_SERVER);
    server.listen(CONF_SERVER.port, CONF_SERVER.host, () => {
      console.log("-".repeat(80))
    });
  });