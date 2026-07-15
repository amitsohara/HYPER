const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

code = code.replace(/case "MISSION_CREATED":/, `case "MISSION_SCHEDULED":
                if (payload.execution?.context) {
                    ctx.mission = payload.execution.context;
                    // Also fire a synthetic observation for the environment if we don't have one
                }
                break;
            case "MISSION_CREATED":`);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Updated HMRC for SCHEDULED");
