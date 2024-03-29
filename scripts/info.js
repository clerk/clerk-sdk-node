const packageJson = require('../package.json');
const fs = require('fs');
const path = require('path');
const executablePath = process.cwd();

fs.writeFileSync(
  path.resolve(executablePath + '/src/info.ts'),
  `
/** DO NOT EDIT: This file is automatically generated by ../scripts/info.js */
export const LIB_VERSION="${packageJson.version}";
export const LIB_NAME="${packageJson.name}";
`,
  { encoding: 'utf-8' }
);
