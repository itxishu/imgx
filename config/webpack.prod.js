const paths = require('./paths');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function (config) {
  const { BUILD_ENV, TYPE_ENV, ANA_TYPE } = config;
  const isBuildWin = BUILD_ENV === 'win'; // 打包是否挂载win对象
  const isCopyLink = TYPE_ENV === 'link';

  return {
    mode: 'production',
    devtool: false,
    output: {
      path: isBuildWin ? paths.appBuildWindow : paths.appBuild,
      filename: isBuildWin ? '[name].es.js' : '[name].js',
      library: isBuildWin
        ? 'fig'
        : {
            type: 'commonjs',
          },
      libraryTarget: isBuildWin ? 'umd' : 'commonjs',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          styles: {
            type: 'css/mini-extract',
            chunks: 'all',
            // If you need this uncomment
            // enforce: true,
          },
        },
      },
      nodeEnv: 'production',
      sideEffects: true,
      concatenateModules: true,
      minimize: true,
      minimizer: [
        // 压缩js
        new TerserPlugin({
          parallel: true, // 多线程
          extractComments: false, // 移除license文件
          terserOptions: {
            compress: {
              comparisons: false, // 关闭二进制优化
            },
            parse: {},
            mangle: true,
            output: {
              comments: false,
              beautify: false,
              ascii_only: true, // 非ASCII字符转换为UTF-8
            },
          },
        }),
      ],
    },
    plugins: [
      ANA_TYPE && new BundleAnalyzerPlugin(),
      isCopyLink &&
        paths.linkPackageProject &&
        new FileManagerPlugin({
          events: {
            onStart: {},
            onEnd: {
              copy: [
                {
                  source: paths.appPackageJson,
                  destination: paths.linkPackageProject,
                },
                {
                  source: paths.appBuild,
                  destination: paths.linkDistProject,
                },
              ],
            },
          },
          runTasksInSeries: true,
        }),
      new CopyPlugin({
        patterns: [
          {
            from: paths.appTypings,
            to: paths.appBuildTypings,
          },
        ],
      }),
    ].filter(Boolean),
    externals: {
      react: 'commonjs react',
    },
  };
};
