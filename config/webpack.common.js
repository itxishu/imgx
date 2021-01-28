const { merge } = require('webpack-merge');
const paths = require('./paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const isProd = ['prod', 'win'].includes(process.env.BUILD_ENV);
const configName = `./webpack.${isProd ? 'prod' : 'dev'}.js`;
const merge_Webpack_Config = require(`./${configName}`); // 加载webpack配置
const WebpackBar = require('webpackbar');
const appPackageJson = require(paths.appPackageJson);
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const config = {
  ...process.env,
};

const webpackConfig = {
  entry: {
    index: isProd ? paths.appIndexJs : paths.appIndexDevJs,
  },
  resolve: {
    alias: {
      '@': paths.appSrc,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  bail: false,
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        use: [
          // {
          //   loader: 'babel-loader',
          //   options: {
          //     cacheDirectory: true,
          //   },
          // },
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(c|le)ss?$/,
        include: [paths.appSrc],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]_[contenthash:8]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
              sourceMap: false,
            },
          },
          'postcss-loader',
        ],
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: appPackageJson.name,
      color: '#00AFF2',
      profile: true,
      minimal: false,
      compiledIn: false,
    }),
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
  ],
  // cache: {
  //   type: 'filesystem',
  //   version: 'v0.0.1',
  // },
  node: {
    global: false,
    __filename: false,
    __dirname: false,
  },
  performance: false,
};

module.exports = merge(webpackConfig, merge_Webpack_Config(config));
