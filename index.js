if (typeof window !== "undefined") {
  module.exports = require('./dist/react-snabbt');
} else {
  module.exports = require('./dist/react-snabbt-server');
}