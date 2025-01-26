const path = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser')
  };
  return config;
};