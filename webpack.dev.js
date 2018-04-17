const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './samples'),
        to: path.resolve(__dirname, './dist/')
      }
    ])
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist')
  }
})
