const path = require('path');
const DeclarationBundlerPlugin = require('./declaration-bundler-webpack-plugin.fix');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    'ts-mixin': path.resolve(__dirname, 'src/index.ts'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin(),
    new UglifyJSPlugin(),
    // new DeclarationBundlerPlugin({
    //   moduleName: '"mylib"',
    //   out: '@types/index.d.ts',
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './package.json',
          to: '../../dist/ts-mixin-generator/package.json',
        },
      ],
    }),
  ],
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false,
    },
  },
};
