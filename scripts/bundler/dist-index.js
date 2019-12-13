if (process.env.NODE_ENV === "development") {
  module.exports = require("./jFactory-devel.cjs.js");
} else {
  module.exports = require("./jFactory.cjs.js");
}