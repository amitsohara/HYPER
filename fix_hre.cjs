const fs = require('fs');
let code = fs.readFileSync('src/server/core/hre1/hreSpecialist.ts', 'utf8');

code = code.replace(
    'Do not wrap in markdown ```json blocks.',
    'Do not wrap in markdown \\`\\`\\`json blocks.'
);

fs.writeFileSync('src/server/core/hre1/hreSpecialist.ts', code);
console.log("Fixed syntax error");
