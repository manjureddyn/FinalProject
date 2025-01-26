const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "fs": false,
          "path": require.resolve("path-browserify"),
          "os": require.resolve("os-browserify/browser")
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    },
  },
};