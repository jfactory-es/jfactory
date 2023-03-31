if (process.env.NODE_ENV === "development") {
  module.exports = require("./$JFACTORY_DEVEL_NAME.umd.js");
} else {
  module.exports = require("./$JFACTORY_PROD_NAME.umd.js");
}