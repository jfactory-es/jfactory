/*!
 * jFactory v1.8.0-alpha 2023-04-04
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2023 Stephane Plazis
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
'use strict';

if (process.env.NODE_ENV === "development") {
  module.exports = require("./es/devel/index.mjs");
} else {
  module.exports = require("./es/index.mjs");
}
