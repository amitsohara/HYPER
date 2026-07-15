const fs = require('fs');

// 1. Update HPAE Specialist to pass missionId
let hpae = fs.readFileSync('src/server/core/hpae1/hpaeSpecialist.ts', 'utf8');
hpae = hpae.replace(/await this\.perceptionManager\.processEnvironment\(\);/, 'await this.perceptionManager.processEnvironment(event.payload?.execution?.missionId || "sys-mission");');
fs.writeFileSync('src/server/core/hpae1/hpaeSpecialist.ts', hpae);

// 2. Update PerceptionManager
let perc = fs.readFileSync('src/server/core/hpae1/perception/PerceptionManager.ts', 'utf8');
perc = perc.replace(/async processEnvironment\(\): Promise<void> \{/, 'async processEnvironment(missionId: string = "sys-mission"): Promise<void> {');
perc = perc.replace(/this\.environmentInterpreter\.interpret\(unifiedObs\);/, 'this.environmentInterpreter.interpret(unifiedObs, missionId);');
fs.writeFileSync('src/server/core/hpae1/perception/PerceptionManager.ts', perc);

// 3. Update EnvironmentInterpreter
let intp = fs.readFileSync('src/server/core/hpae1/perception/EnvironmentInterpreter.ts', 'utf8');
intp = intp.replace(/interpret\(unifiedObs: UnifiedObservation\): void \{/, 'interpret(unifiedObs: UnifiedObservation, missionId: string = "sys-mission"): void {');
intp = intp.replace(/payload: unifiedObs/, 'payload: { ...unifiedObs, missionId }');
fs.writeFileSync('src/server/core/hpae1/perception/EnvironmentInterpreter.ts', intp);

console.log("Updated HPAE to propagate missionId");
