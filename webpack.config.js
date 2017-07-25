const webpack = require('webpack');
const PROD = (process.env.NODE_ENV === 'production');

const plugins = PROD ? new webpack.optimize.UglifyJsPlugin({
  compress: { warnings: false }
}) : [];

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: PROD ? 'dist/umd/oddstream.umd.min.js' : 'dist/umd/oddstream.umd.js',
    library: 'Oddstream',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
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
