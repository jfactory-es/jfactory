if (process.env.NODE_ENV === "development") {
  module.exports = require("./es-devel/index.mjs");
} else {
  module.exports = require("./es/index.mjs");
}