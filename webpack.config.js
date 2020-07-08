const { resolve } = require('path');

const getCssLoader = () => {
  return {
    loader: 'css-loader',
    options: {
      sourceMap: false,
      modules: true,
    },
  };
};

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
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', getCssLoader(), 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.svg$/,
        use: 'raw-loader',
      },
    ],
  },
};
