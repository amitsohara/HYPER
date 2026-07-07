const fs = require('fs');
let code = fs.readFileSync('src/components/MissionControlApp.tsx', 'utf8');

code = code.replace(
`hii.metrics.missionSuccessRate`,
`hii.metrics?.missionSuccessRate`
);

fs.writeFileSync('src/components/MissionControlApp.tsx', code);
