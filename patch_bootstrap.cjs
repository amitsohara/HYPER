const fs = require('fs');
let p = 'bootstrap.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
    'import { HSMESpecialist } from "./src/server/core/hsme1/hsmeSpecialist.js";',
    'import { HSMESpecialist } from "./src/server/core/hsme1/hsmeSpecialist.js";\nimport { HILASpecialist } from "./src/server/core/hila1/hilaSpecialist.js";'
);
code = code.replace(
    'await hcse.registerSpecialist(new HSMESpecialist(eventMesh));',
    'await hcse.registerSpecialist(new HSMESpecialist(eventMesh));\n        await hcse.registerSpecialist(HILASpecialist.getInstance());'
);
fs.writeFileSync(p, code);
