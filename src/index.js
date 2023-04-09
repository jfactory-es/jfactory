if (process.env.NODE_ENV === "development") {
  module.exports = require("./devel/index.mjs");
} else {
  module.exports = require("./index.mjs");
}