/*!
 * jFactory v1.7.5
 * http://github.com/jfactory-es/jfactory
 * (c) 2019-2021, Stéphane Plazis, http://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt
 */
'use strict';

if (process.env.NODE_ENV === "development") {
  module.exports = require("./jFactory-devel.umd.js");
} else {
  module.exports = require("./jFactory.umd.js");
}
