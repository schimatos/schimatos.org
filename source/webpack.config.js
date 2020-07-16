const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//const ReducerImportsPlugin = require('./webpack-plugins/reducer-imports-plugin')
const {WebpackWarPlugin} = require('webpack-war-plugin')
const outputDirectory = './dist'; // Needs to be fiddled with

module.exports = {
  node: {
    fs: "empty"
  },
  entry: {
    index: './src/client/index.js',
    // admin: './src/admin/index.js',
    // supplier: './src/supplier/index.js'
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'static/js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:5000'
    },
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{ from: /^\/admin.html/, to: '/build/admin.html' }]
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      dry : true,
      verbose : true
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      chunks: ['index']
    }),
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   filename: 'admin/index.html',
    //   chunks: ['admin']
    // }),
    // new HtmlWebpackPlugin({
    //   template: './public/index.html',
    //   filename: 'supplier/index.html',
    //   chunks: ['supplier']
    // }),
    new WebpackWarPlugin({
      archiveName: 'schimatos_app_TEST_3'
    })
  ]
};

// archiveName?: string;
// webInf?: string;
// additionalElements?: {
//     path: string;
//     destPath?: string;
// }[];