const fs = require('fs');
let code = fs.readFileSync('src/server/core/hre1/hreSpecialist.ts', 'utf8');

if (!code.includes('import * as fs')) {
    code = 'import * as fs from "fs";\n' + code;
}

fs.writeFileSync('src/server/core/hre1/hreSpecialist.ts', code);
