const fs = require('fs');
const path = require('path');
const nodezip = require('node-zip');
const zip = new nodezip();

zip.file(
  'index.js',
  fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.js')),
);

const data = zip.generate({ base64: false, compression: 'DEFLATE' });

const package = require(path.join(__dirname, '..', 'package.json'));

fs.writeFileSync(
  path.join(__dirname, '..', 'dist', `function.zip`),
  data,
  'binary',
);
