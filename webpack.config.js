const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index',
  output: {
    filename: 'imgx.min.js',
    path: resolve(__dirname, './dist'),
    publicPath: '/',
    libraryTarget: 'commonjs',
  },
  target: 'node',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js|ts|tsx)?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    sideEffects: true,
    concatenateModules: true,
    minimize: true,
    minimizer: [
      // 压缩js
      new TerserPlugin({
        cache: true,
        parallel: true,
        extractComments: false,
        terserOptions: {
          warnings: false,
          compress: {
            comparisons: false,
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true, // 多线程
        sourceMap: false,
      }),
    ],
  },
  externals: {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
    'prop-types': 'commonjs prop-types',
  },
};
