const fs = require('fs');

const path = 'src/components/MissionControlApp.tsx';
let code = fs.readFileSync(path, 'utf8');

// Import EngineStatusView
if (!code.includes('EngineStatusView')) {
    code = code.replace(
        'import { ReplayCenterView } from "./mission/ReplayCenterView";',
        'import { ReplayCenterView } from "./mission/ReplayCenterView";\nimport { EngineStatusView } from "./mission/EngineStatusView";'
    );
}

// Add nav item
if (!code.includes('id: "engine_status"')) {
    code = code.replace(
        '{ id: "mission_control", label: "Mission Control", icon: Target },',
        '{ id: "mission_control", label: "Mission Control", icon: Target },\n    { id: "engine_status", label: "Engine Status", icon: Activity },'
    );
}

// Add view render
if (!code.includes('<EngineStatusView />')) {
    code = code.replace(
        '{activeTab === \'mission_control\' && <MissionControlView onLaunchNew={() => setActiveTab(\'mission_builder\')} />}',
        '{activeTab === \'mission_control\' && <MissionControlView onLaunchNew={() => setActiveTab(\'mission_builder\')} />}\n          {activeTab === \'engine_status\' && <EngineStatusView />}'
    );
}

// Add to fallback array
if (!code.includes("'engine_status'")) {
    code = code.replace(
        "['dashboard', 'active_mission_detail', 'mission_control', 'mission_builder',",
        "['dashboard', 'active_mission_detail', 'mission_control', 'engine_status', 'mission_builder',"
    );
}

fs.writeFileSync(path, code);
