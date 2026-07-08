const fs = require('fs');
let p = 'src/server/core/hpe1/engines/PlannerOrchestrator.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
    'if (response && response.content) {',
    'console.log(`[PlannerOrchestrator] response exists: ${!!response}, content: ${response?.content}`);\nif (response && response.content) {'
);
fs.writeFileSync(p, code);
