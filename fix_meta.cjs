const fs = require('fs');
let code = fs.readFileSync('src/components/MetaCognitionDashboard.tsx', 'utf8');

code = code.replace(
`        const [missionRes, capRes, execRes, scoresRes, graphRes] = await Promise.all([
          fetch('/api/meta/mission').then(r => r.json()),
          fetch('/api/meta/capabilities').then(r => r.json()),
          fetch('/api/meta/execution-plan').then(r => r.json()),
          fetch('/api/meta/module-scores').then(r => r.json()),
          fetch('/api/meta/mission-graph').then(r => r.json())
        ]);`,
`        const [missionRes, capRes, execRes, scoresRes, graphRes] = await Promise.all([
          fetch('/api/meta/mission').then(r => r.json().catch(() => ({}))),
          fetch('/api/meta/capabilities').then(r => r.json().catch(() => ([]))),
          fetch('/api/meta/execution-plan').then(r => r.json().catch(() => ({}))),
          fetch('/api/meta/module-scores').then(r => r.json().catch(() => ([]))),
          fetch('/api/meta/mission-graph').then(r => r.json().catch(() => ({ nodes: [], edges: [] })))
        ]);`);

fs.writeFileSync('src/components/MetaCognitionDashboard.tsx', code);
