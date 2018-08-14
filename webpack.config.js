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
    'js/client.js' :
    [`webpack-dev-server/client?http://localhost:${9000}`, 'js/client.js'],
  devtool: isProd ? false : 'cheap-module-source-map',
  context: `${__dirname}/client`,
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
    rules: [
      {test:/\.css$/, loader: ['style-loader', 'css-loader']},
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
          presets: ['react', 'es2015', 'stage-0']
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
    port: 9000,
    public: `localhost:${9000}`,
    host: '0.0.0.0',
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    proxy:{
      '/socket.io/socket.io.js': {
        target: `http://localhost:${3000}/socket.io/socket.io.js`,
        ws: false
      },
      '/socket.io/*': {
        target: `ws://localhost:${3000}/socket.io`,
        ws: true,
      },
      '*': {
        target: `http://localhost:${3000}`,
      }
    }
  };
  config.output.publicPath = `http://localhost:${9000}/static/`;
}
module.exports = config;
