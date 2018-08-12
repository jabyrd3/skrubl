'use strict';
/* globals __dirname, require, process */
const path = require('path');
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';

const url = (suffix) => {
  return `/static/${suffix}`;
};

// todo: dry this with portal webpack conf
 
let config = {
  entry: isProd ?
    'index.js' :
    [`react-hot-loader/patch`, `webpack-dev-server/client?https://localhost:${process.env.DEV_PORT}`, 'index.js'],
  devtool: isProd ? false : 'cheap-module-source-map',
  context: `${__dirname}/js`,
  watchOptions: {
    ignored: /node_modules/
  },
  resolve: {
    modules: [
      path.resolve('./client/js'),
      path.resolve('./client/scss'),
      path.resolve('./node_modules'),
      path.resolve('./client'),
    ]
  },
  output: {
    path: `${__dirname}/client/build`,
    filename: 'drawgame.js',
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: ['node_modules'],
        include: [
          path.resolve(__dirname, './client/scss'),
          path.resolve(__dirname, './client/assets')
        ]
      },
      {test: /\.(woff|woff2|eot|ttf|svg)$/, loader: 'file-loader'},
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: 'file-loader',
        include: [path.resolve(__dirname, './client/assets')]
      },
      {test: /\.(js|jsx)$/,
        include:[
          path.resolve(__dirname, 'client/js')
        ],
        exclude: ['lodash'],
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['transform-decorators-legacy']
        }
      }
    ]
  },
  // env conditional plugins for filesize, dashboard, etc.
  plugins: isProd ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new MinifyPlugin()
  ] : []
};
if (!isProd){
  config.devServer = {
    contentBase: './client/build/',
    compress: true,
    port: conf.devPort,
    public: `localhost:${process.env.DEV_PORT}`,
    host: '0.0.0.0',
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    proxy:{
      '/socket.io/socket.io.js': {
        target: `http://localhost:${conf.port}/socket.io/socket.io.js`,
        ws: false
      },
      '/socket.io/*': {
        target: `ws://localhost:${conf.port}/socket.io`,
        ws: true,
      },
      '*': {
        target: `http://localhost:${conf.port}`,
      }
    }
  };
  config.output.publicPath = `https://localhost:${process.env.DEV_PORT}/static/`;
}
module.exports = config;
