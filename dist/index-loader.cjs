/*!
 * jFactory v1.8.0-alpha.2+build.1730675680538
 * https://github.com/jfactory-es/jfactory
 * (c) 2019-2024 Stephane Plazis <sp.jfactory@gmail.com>
 * License: https://raw.githubusercontent.com/jfactory-es/jfactory/master/LICENSE.md
 */
if (process.env.NODE_ENV === 'development') {
  module.exports = require('jfactory/cjs-devel');
} else {
  module.exports = require('jfactory/cjs');
}
