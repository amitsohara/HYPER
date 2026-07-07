const fs = require('fs');
let code = fs.readFileSync('src/server/core/hila1/core/IntelligenceArbitrator.ts', 'utf8');
code = code.replace(/\{ type: "MODEL_SELECTED", source: "HILA", payload: \{ provider: response\.provider \} \}/g, '{ type: "MODEL_SELECTED", source: "HILA", domain: CognitiveDomain.SYSTEM, priority: 1, payload: { provider: response.provider } }');
fs.writeFileSync('src/server/core/hila1/core/IntelligenceArbitrator.ts', code);
