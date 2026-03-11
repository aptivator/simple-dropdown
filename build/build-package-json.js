let fs          = require('fs');
let path        = require('path');
let packageJson = require('../package.json');

let libraryName = 'simple-dropdown';
let packageJsonPath = path.resolve(__dirname, '..', 'dist', 'package.json');
let excludeFields = ['scripts', 'devDependencies'];
let mainFile = './' + libraryName + '.umd.js';
let moduleFile = './' + libraryName + '.es.js';

for(let field of excludeFields) {
  delete packageJson[field];
}

Object.assign(packageJson, {
  main: mainFile,
  module: moduleFile,
  exports: {
    '.': {
      require: mainFile,
      import: moduleFile
    }
  }
});

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
