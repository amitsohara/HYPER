const fs = require('fs');

let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

code = code.replace(/        let directive = ctx\.mission\?\.directive \|\| ctx\.mission\?\.name \|\| ctx\.mission\?\.missionDirective \|\| "";/, `        console.log("ctx.mission:", JSON.stringify(ctx.mission));
        let directive = ctx.mission?.directive || ctx.mission?.name || ctx.mission?.missionDirective || "";`);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
