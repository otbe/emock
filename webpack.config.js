var webpack = require('webpack');

module.exports = {
  entry: [
    './src/emock.ts'
  ],
  externals: {
    'is-equal': 'umd is-equal',
    'expect': 'umd expect'
  },
  output: {
    path: './generated',
    filename: 'emock.js',
    library: 'emock',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: [ /node_modules/ ],
        loaders: [ 'babel-loader', 'ts-loader' ]
      }
    ]
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [ '', '.ts', '.js' ],
    modulesDirectories: [ 'node_modules' ]
  }
};
