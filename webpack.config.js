const { resolve } = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'imgx.min.js',
    path: resolve(__dirname, './dist'),
    publicPath: '/',
    libraryTarget: 'commonjs',
    // libraryTarget: 'umd',
    // library: 'Imgx',
  },
  node: false,
  devtool: 'source-map',
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    },{
      test: /\.svg$/,
      use: 'raw-loader',
    }],
  },
};
 