const fs = require('fs');

let code = fs.readFileSync('src/components/mission/MissionQueueView.tsx', 'utf8');
code = code.replace(/Object\.entries\(groupedMissions\)\.map\(\(\[status, list\]\) => \{/g, 'Object.entries(groupedMissions).map(([status, list]: [string, any]) => {');
fs.writeFileSync('src/components/mission/MissionQueueView.tsx', code);
