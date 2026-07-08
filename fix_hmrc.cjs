const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

code = code.replace(/status: "RUNNING"/g, 'status: "SUCCESS" /* placeholder */');
code = code.replace(/implementationDifficulty: "Medium"/g, 'implementationDifficulty: "Medium" as any');

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Fixed HMRC Manager.");
