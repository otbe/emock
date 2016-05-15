var conf = require('./webpack.config');

conf.devtool = 'inline-source-map';

delete conf.entry;
delete conf.output;
delete conf.externals;

conf.ts = {
  compilerOptions: {
    declaration: false
  }
};

conf.entry = [
  './tests/tests.index.js'
];

conf.output = {
  path: './generated',
  devtoolModuleFilenameTemplate: './[resource-path]',
  filename: 'tests.js'
};

module.exports = conf;
