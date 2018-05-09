const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const _ = require('lodash');
const { resolve } = require('path');
const webpack = require('webpack');

const buildConfig = (env) => {
  const entry = [
    './index.jsx',
    './styles/index.scss'
  ];

  const devEntry = [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server'
  ];

  const plugins = [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
    new webpack.HotModuleReplacementPlugin()
  ];

  const productionPlugins = [
    new HtmlWebpackPlugin({
      template: `${__dirname}/app/index.html`,
      filename: 'index.html',
      inject: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false
    })
  ];

  return {
    devtool: env === 'production' ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
    entry: env === 'production' ? entry : _.concat(devEntry, entry),
    plugins: env === 'production' ? _.concat(plugins, productionPlugins) : plugins,

    devServer: env === 'production' ? undefined : {
      hot: true,
      contentBase: resolve(__dirname, 'app'),
      publicPath: '/'
    },

    context: resolve(__dirname, 'app'),
    output: {
      filename: 'bundle.js',
      path: resolve(__dirname, 'dist'),
      publicPath: '',
    },

    resolve: {
      extensions: ['.js', '.jsx']
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loaders: [
            'babel-loader',
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'sass-loader',
                query: {
                  sourceMap: false,
                },
              },
            ],
            publicPath: '../'
          }),
        }
      ]
    },
  };
};

module.exports = buildConfig;
