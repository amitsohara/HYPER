const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('MissionLogger')) {
    code = code.replace(
        'import { HIICalculator } from "./src/server/core/hco1/metrics/HII_Calculator.js";',
        'import { HIICalculator } from "./src/server/core/hco1/metrics/HII_Calculator.js";\nimport { MissionLogger } from "./src/server/core/logging/MissionLogger.js";'
    );
    
    code = code.replace(
        '  initSociety().catch(console.error);',
        '  initSociety().catch(console.error);\n  MissionLogger.getInstance();'
    );
    
    fs.writeFileSync('server.ts', code);
    console.log("Patched server.ts");
} else {
    console.log("Already patched");
}
