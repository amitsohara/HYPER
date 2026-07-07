const fs = require('fs');
let code = fs.readFileSync('src/components/MissionControlApp.tsx', 'utf8');

code = code.replace(
`{m.hii.toFixed(1)}%`,
`{(m.hii || 0).toFixed(1)}%`
);

fs.writeFileSync('src/components/MissionControlApp.tsx', code);
