/*!
 * jFactory v1.8.0-alpha.2 2024-10-27
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2024 Stephane Plazis <sp.jfactory@gmail.com>
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.txt
 */
'use strict';

if (process.env.NODE_ENV === "development") {
  module.exports = require("./es-devel/index.mjs");
} else {
  module.exports = require("./es/index.mjs");
}
