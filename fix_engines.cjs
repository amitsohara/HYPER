const fs = require('fs');

// 1. Fix HDMESpecialist
let hdme = fs.readFileSync('src/server/core/hdme1/hdmeSpecialist.ts', 'utf8');
hdme = hdme.replace(/const context: DecisionContext = \{ missionId: "sys-mission", worldStateSnapshot: ws \};/g, 'const context: DecisionContext = { missionId: event.payload?.missionId || "sys-mission", worldStateSnapshot: ws };');
fs.writeFileSync('src/server/core/hdme1/hdmeSpecialist.ts', hdme);
console.log("Fixed HDMESpecialist.ts");

// 2. Fix HPAESpecialist
let hpae = fs.readFileSync('src/server/core/hpae1/hpaeSpecialist.ts', 'utf8');
hpae = hpae.replace(/missionId: event\.payload\.decision\?\.missionId \|\| "sys-mission"/g, 'missionId: event.payload?.action?.missionId || event.payload?.missionId || event.payload?.decision?.missionId || "sys-mission"');
// Wait, action doesn't have missionId in HPAESpecialist
hpae = hpae.replace(/const action: Action = \{/, 'const action: Action = { missionId: event.payload?.missionId || "sys-mission",');
fs.writeFileSync('src/server/core/hpae1/hpaeSpecialist.ts', hpae);
console.log("Fixed HPAESpecialist.ts");

