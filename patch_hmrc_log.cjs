const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

code = code.replace(/const mId = this\.extractMissionId\(event\);/, `const mId = this.extractMissionId(event);
        if (mId === "sys-mission") {
            console.log(\`[HMRC] sys-mission EVENT: \${event.type}\`, JSON.stringify(payload, null, 2));
        }`);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Patched HMRC logging");
