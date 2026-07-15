const fs = require('fs');

let types = fs.readFileSync('src/server/core/hos1/types.ts', 'utf8');
types = types.replace(/results\?: any\[\];\n    status\?: string;\n\}/, `results?: any[];\n    status?: string;\n    metadata?: any;\n}`);
fs.writeFileSync('src/server/core/hos1/types.ts', types);

let mgr = fs.readFileSync('src/server/core/hos1/managers/MissionManagers.ts', 'utf8');
mgr = mgr.replace(/createMission\(name: string, priority: number, directive: string = "", description: string = "", objective: string = ""\): MissionContext \{/, `createMission(name: string, priority: number, directive: string = "", description: string = "", objective: string = "", metadata: any = {}): MissionContext {`);
mgr = mgr.replace(/results: \[\]\n        \};/g, `results: [],\n            metadata\n        };`);
fs.writeFileSync('src/server/core/hos1/managers/MissionManagers.ts', mgr);

