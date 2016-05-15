/// <reference path="../node_modules/reflect-metadata/reflect-metadata.d.ts" />
/// <reference path="../src/is-equal.d.ts" />

var testsContext = require.context(".", true, /\.ts$/);
testsContext.keys().forEach(testsContext);
