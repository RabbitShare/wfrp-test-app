const path = require("path");

module.exports = {
  default: {
    paths: ["tests/features/**/*.feature"],
    import: ["tests/steps/**/*.ts", "tests/support/**/*.ts"],
    format: ["progress"],
    timeout: 60000,
    parallel: 1,
  },
};
