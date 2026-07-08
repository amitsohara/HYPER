const fs = require('fs');
let code = fs.readFileSync('src/server/core/logging/MissionLogger.ts', 'utf8');

code = code.replace(
    "'mission_execution.log'",
    "'mission_execution_log.txt'"
);

fs.writeFileSync('src/server/core/logging/MissionLogger.ts', code);
