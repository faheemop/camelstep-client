const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

dotenv.config();
console.log(path.join(__dirname));
// eslint-disable-next-line immutable/no-mutation
module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({}), new TerserPlugin({ parallel: true })],
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData:
                '@import "src/assets/styles/_variables.scss"; @import "src/assets/styles/_mixins.scss"; @import "src/assets/styles/utils.scss";',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|webp)$/,
        loader: 'url-loader',
        options: { limit: 1280 },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        issuer: /\.css$/,
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
    ],
  },
  devServer: {
    static: {
      watch: false,
      directory: path.resolve(__dirname, 'dist'),
      publicPath: path.resolve(__dirname, 'public'),
    },
    allowedHosts: 'all',
    hot: true,
    port: 4410,
    host: '0.0.0.0',
    compress: true,
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'index.[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: path.resolve(__dirname, 'dist/index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['index.html'],
          },
        },
      ],
    }),
  ],
};
