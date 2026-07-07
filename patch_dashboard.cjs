const fs = require('fs');

const path = 'src/components/MissionControlApp.tsx';
let code = fs.readFileSync(path, 'utf8');

// Import it
if (!code.includes('LiveCognitivePipelineView')) {
    code = code.replace(
        'import { ReplayCenterView } from "./mission/ReplayCenterView";',
        'import { ReplayCenterView } from "./mission/ReplayCenterView";\nimport { LiveCognitivePipelineView } from "./mission/LiveCognitivePipelineView";'
    );
}

// Add it to DashboardView right below the metric cards and above the 2-col layout
if (!code.includes('<LiveCognitivePipelineView />')) {
    code = code.replace(
        '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">',
        '<LiveCognitivePipelineView />\n\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">'
    );
}

// Add as a tab maybe? The user didn't explicitly ask for a tab, just "in the center", so placing it in the dashboard is good.
// I will also add the navigation item just in case, or leave it just in Dashboard. I'll just leave it in Dashboard.

fs.writeFileSync(path, code);
