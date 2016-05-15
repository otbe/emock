var fs = require('fs');
var EOL = require('os').EOL;

var typeDefinitions = fs.readFileSync('dist/emock.d.ts', { encoding: 'utf-8' });
typeDefinitions = typeDefinitions.split(EOL);

var imports = [];
var exports = [];

for(var i = 0; i < typeDefinitions.length; i++) {
  if(typeDefinitions[i].indexOf('///') === 0) {
    typeDefinitions[i] = '';
  }

  var containsExport = typeDefinitions[i].indexOf('export') === 0;
  var fromIndex = typeDefinitions[i].indexOf('from');

  if(containsExport && fromIndex !== -1) {
    // remove from part of export statement of library code because all declarations are within the same file
    typeDefinitions[i] = typeDefinitions[i].substr(0, fromIndex);
  } else if(containsExport) {
    // remove exports that are not real lib exports
    typeDefinitions[i] = typeDefinitions[i].replace('export ', '');
  }

  if(typeDefinitions[i].indexOf('export') === 0) {
    exports.push(i);
  }

  if(typeDefinitions[i].indexOf('import') === 0) {
    imports.push(i);
  }
}

var result = [];

for(i = 0; i < typeDefinitions.length; i++) {
  if(imports.indexOf(i) === -1 && exports.indexOf(i) === -1 && typeDefinitions[i].length > 0) {
    result.push(typeDefinitions[i]);
  }
}

// push imports to the top
for(i = 0; i < imports.length; i++) {
  result.unshift(typeDefinitions[imports[i]]);
}

// push exports to the bottom
for(i = 0; i < exports.length; i++) {
  result.push(typeDefinitions[exports[i]]);
}

fs.writeFileSync('dist/emock.d.ts', result.join(EOL));
