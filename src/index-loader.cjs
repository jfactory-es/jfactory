if (process.env.NODE_ENV === 'development') {
  module.exports = require('jfactory/cjs-devel');
} else {
  module.exports = require('jfactory/cjs');
}