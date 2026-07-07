const fs = require('fs');
let code = fs.readFileSync('src/components/MissionControlApp.tsx', 'utf8');

code = code.replace(
`value={(hii.overallIntelligence * 100).toFixed(1) + '%'}`,
`value={((hii?.overallIntelligence || 0) * 100).toFixed(1) + '%'}`
);

code = code.replace(
`value={(hii.metrics?.missionSuccessRate * 100).toFixed(1) + '%'}`,
`value={((hii?.metrics?.missionSuccessRate || 0) * 100).toFixed(1) + '%'}`
);

fs.writeFileSync('src/components/MissionControlApp.tsx', code);
