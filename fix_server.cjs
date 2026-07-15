const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/source: "MissionControlUI",\s*payload: {/g, 'source: "MissionControlUI",\n            payload: {\n                missionId: "sys-mission",');
fs.writeFileSync('server.ts', code);
console.log("Fixed server.ts");
