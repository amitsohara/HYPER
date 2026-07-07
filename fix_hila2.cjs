const fs = require('fs');
let code = fs.readFileSync('src/server/core/hila1/core/IntelligenceArbitrator.ts', 'utf8');
code = code.replace(
`        this.eventMesh.publish({
            type: "MODEL_SELECTED",
            source: "HILA",
            payload: { provider: decision.selectedProvider }
        });`,
`        this.eventMesh.publish({
            type: "MODEL_SELECTED",
            source: "HILA",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            payload: { provider: decision.selectedProvider }
        });`);
fs.writeFileSync('src/server/core/hila1/core/IntelligenceArbitrator.ts', code);
