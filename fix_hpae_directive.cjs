const fs = require('fs');

// 1. Update HPAE Specialist to pass directive
let hpae = fs.readFileSync('src/server/core/hpae1/hpaeSpecialist.ts', 'utf8');
hpae = hpae.replace(/await this\.perceptionManager\.processEnvironment\(event\.payload\?\.execution\?\.missionId \|\| "sys-mission"\);/, 
`const exec = event.payload?.execution;
            await this.perceptionManager.processEnvironment(
                exec?.missionId || "sys-mission",
                exec?.context?.directive || ""
            );`);
fs.writeFileSync('src/server/core/hpae1/hpaeSpecialist.ts', hpae);

// 2. Update PerceptionManager
let perc = fs.readFileSync('src/server/core/hpae1/perception/PerceptionManager.ts', 'utf8');
perc = perc.replace(/async processEnvironment\(missionId: string = "sys-mission"\): Promise<void> \{/, 'async processEnvironment(missionId: string = "sys-mission", directive: string = ""): Promise<void> {');
perc = perc.replace(/this\.environmentInterpreter\.interpret\(unifiedObs, missionId\);/, 'this.environmentInterpreter.interpret(unifiedObs, missionId, directive);');
fs.writeFileSync('src/server/core/hpae1/perception/PerceptionManager.ts', perc);

// 3. Update EnvironmentInterpreter
let intp = fs.readFileSync('src/server/core/hpae1/perception/EnvironmentInterpreter.ts', 'utf8');
intp = intp.replace(/interpret\(unifiedObs: UnifiedObservation, missionId: string = "sys-mission"\): void \{/, 'interpret(unifiedObs: UnifiedObservation, missionId: string = "sys-mission", directive: string = ""): void {');
intp = intp.replace(/payload: \{ \.\.\.unifiedObs, missionId \}/, 'payload: { ...unifiedObs, missionId, missionDirective: directive, entity: { name: "User Request", type: "MISSION_DIRECTIVE" } }');
fs.writeFileSync('src/server/core/hpae1/perception/EnvironmentInterpreter.ts', intp);

console.log("Updated HPAE to propagate directive");
