const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
console.log(paths.appBuild, 'paths.appBuild');
module.exports = function (config) {
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
      path: paths.appBuild,
      filename: '[name].js',
    },
    devServer: {
      contentBase: paths.appSrc,
      disableHostCheck: true,
      historyApiFallback: true,
      compress: true,
      open: true,
      // host: '0.0.0.0',
      port: 8999,
      hot: true,
      proxy: {
        '/v1': {
          target: 'https://api.jonhuu.com',
          changeOrigin: true,
          secure: true,
          ws: true, // proxy websockets
          pathRewrite: {
            // '^/v1': '',
          },
        },
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        CONFIG: {
          BUILD_ENV: config.BUILD_ENV,
        },
      }),
    ],
  };
};
