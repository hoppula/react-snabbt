if (typeof window !== "undefined") {
  module.exports = require('./dist/react-snabbt-dom');
} else {
  module.exports = require('./dist/react-snabbt-server');
}
