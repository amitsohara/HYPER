const fs = require('fs');
let p = 'src/server/core/hpe1/engines/PlannerOrchestrator.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
    'if (hila && hila.arbitrator) {',
    'console.log(`[PlannerOrchestrator] hila exists: ${!!hila}, arbitrator exists: ${!!hila?.arbitrator}`);\nif (hila && hila.arbitrator) {'
);
fs.writeFileSync(p, code);
