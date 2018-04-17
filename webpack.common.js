const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/cl.api'
  },
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  output: {
    filename: 'ClChart.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ClChart',
    libraryTarget: 'umd',
    umdNamedDefine: true
  }
}
