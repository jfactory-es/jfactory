/*!
 * jFactory v1.7.4
 * https://github.com/jfactory-es/jfactory
 *
 * Copyright (c) 2019, Stéphane Plazis
 * https://github.com/jfactory-es/jfactory/blob/master/LICENSE.txt
 */
'use strict';

if (process.env.NODE_ENV === "development") {
  module.exports = require("./jFactory-devel.cjs.js");
} else {
  module.exports = require("./jFactory.cjs.js");
}
