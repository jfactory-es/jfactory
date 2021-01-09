if (process.env.NODE_ENV === "development") {
  module.exports = require("./JFACTORY_$FILENAME-devel.umd.js");
} else {
  module.exports = require("./JFACTORY_$FILENAME.umd.js");
}