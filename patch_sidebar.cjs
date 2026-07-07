const fs = require('fs');
const path = 'src/components/MissionControlApp.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import { HUIVDashboardView }')) {
    code = code.replace(
        /import { EngineStatusView } from "\.\/mission\/EngineStatusView";/,
        `import { EngineStatusView } from "./mission/EngineStatusView";\nimport { HUIVDashboardView } from "./mission/HUIVDashboardView";\nimport { ShieldCheck } from "lucide-react";`
    );

    code = code.replace(
        /\{ id: "settings", label: "Settings", icon: Settings \}/,
        `{ id: "settings", label: "Settings", icon: Settings },\n    { id: "huiv", label: "HUIV Validation", icon: ShieldCheck }`
    );

    code = code.replace(
        /\{activeTab === 'settings' && <SettingsView \/>\}/,
        `{activeTab === 'settings' && <SettingsView />}\n          {activeTab === 'huiv' && <HUIVDashboardView />}`
    );
}

fs.writeFileSync(path, code);
