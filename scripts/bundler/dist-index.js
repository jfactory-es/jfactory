if (process.env.NODE_ENV === "development") {
  module.exports = require("./JFACTORY_$NAME-devel.umd.js");
} else {
  module.exports = require("./JFACTORY_$NAME.umd.js");
}