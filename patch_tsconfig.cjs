const fs = require('fs');
const config = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
config.compilerOptions.downlevelIteration = true;
config.compilerOptions.esModuleInterop = true;
fs.writeFileSync('tsconfig.json', JSON.stringify(config, null, 2));
