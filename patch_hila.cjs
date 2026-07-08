const fs = require('fs');
let p = 'src/server/core/hila1/hilaSpecialist.ts';
let code = fs.readFileSync(p, 'utf8');

code = code.replace(
    'public async initialize(): Promise<void> {',
    'public async initialize(): Promise<void> {\nconsole.log("[HILA] initialize called!");'
);
code = code.replace(
    'this.arbitrator = new IntelligenceArbitrator(this.providerManager, modelRouter, mesh);',
    'this.arbitrator = new IntelligenceArbitrator(this.providerManager, modelRouter, mesh);\nconsole.log("[HILA] arbitrator assigned! type:", typeof this.arbitrator);'
);
fs.writeFileSync(p, code);
