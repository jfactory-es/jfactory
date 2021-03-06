// ----------------------------
// Test suite web configuration
// ----------------------------

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports =  {
  mode: "development",

  devtool: "eval-source-map",

  // devtool: "inline-source-map",
  // devtool: "cheap-eval-source-map",
  // devtool: "eval",
  // devtool: "hidden-source-map",
  // devtool: "nosources-source-map",
  // devtool: "eval-source-map",

  entry: {
    testsuite: "./test/index.js"
  },

  output: {
    filename: "[name].js"
  },

  // excludes imports to load them externally from browser, see ./test-template.html
  // See advanced options: https://webpack.js.org/configuration/externals/
  // Could be used with https://www.npmjs.com/package/webpack-cdn-plugin
  // externals: {
  //   lodash: "_",
  //   jquery: "$"
  // },

  module: {
    rules: [
      {
        // imports source map (for "bundle" build)
        test: /\.(js|mjs)$/,
        enforce: "pre",
        use: ["source-map-loader"]
      },
      {
        test: /.test\.js$/,
        use: "mocha-loader",
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      COMPILER_WEBPACK: true,
      // By default webpack rewrites all "process.env.NODE_ENV"
      // depending on the value of the "mode" option (see above)
      // However, we want to always use the value defined by the script env,
      // to allow conditional compile based on process.env.NODE_ENV
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      filename: "testsuite.html",
      template: "./scripts/dev/test-template.html",
      title: "jFactory Test",
      inject: "body"
    })
  ]
};