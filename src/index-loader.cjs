if (process.env.NODE_ENV === 'development') {
  module.exports = require('./cjs-devel/index.cjs');
} else {
  module.exports = require('./cjs/index.cjs');
}