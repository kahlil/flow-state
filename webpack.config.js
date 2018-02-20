const webpack = require('webpack');
const PROD = (process.env.NODE_ENV === 'production');

const plugins = PROD ? new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false }
}) : [];

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: PROD ? 'dist/umd/flow-state.umd.min.js' : 'dist/umd/flow-state.umd.js',
    library: 'FlowState',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  externals: {
    // Use external version of React
    "rxjs": "RxJS"
  },
  module: {
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { 
        test: /\.tsx?$/, 
        loader: 'ts-loader',
      }
    ]
  },
  plugins: [].concat(plugins)
}
