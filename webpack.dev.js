const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './samples/web'),
        to: path.resolve(__dirname, './dist/')
      }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist')
  }
})
