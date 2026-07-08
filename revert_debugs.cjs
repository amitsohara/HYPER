const fs = require('fs');

// HILA Specialist
let p1 = 'src/server/core/hila1/hilaSpecialist.ts';
let code1 = fs.readFileSync(p1, 'utf8');
code1 = code1.replace('public async initialize(): Promise<void> {\\nconsole.log("[HILA] initialize called!");', 'public async initialize(): Promise<void> {');
code1 = code1.replace('this.arbitrator = new IntelligenceArbitrator(this.providerManager, modelRouter, mesh);\\nconsole.log("[HILA] arbitrator assigned! type:", typeof this.arbitrator);', 'this.arbitrator = new IntelligenceArbitrator(this.providerManager, modelRouter, mesh);');
fs.writeFileSync(p1, code1);

// PlannerOrchestrator
let p2 = 'src/server/core/hpe1/engines/PlannerOrchestrator.ts';
let code2 = fs.readFileSync(p2, 'utf8');
code2 = code2.replace('console.log(`[PlannerOrchestrator] hila exists: ${!!hila}, arbitrator exists: ${!!hila?.arbitrator}`);\\nif (hila && hila.arbitrator) {', 'if (hila && hila.arbitrator) {');
code2 = code2.replace('console.log(`[PlannerOrchestrator] response exists: ${!!response}, content: ${response?.content}`);\\nif (response && response.content) {', 'if (response && response.content) {');
fs.writeFileSync(p2, code2);

