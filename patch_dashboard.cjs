const fs = require('fs');
const path = 'src/components/MissionControlApp.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetImports = `} from "lucide-react";`;
const replacementImports = `  Power, ListTree
} from "lucide-react";`;
if(code.includes(targetImports)) {
    code = code.replace(targetImports, replacementImports);
}

const targetCards = `<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Overall Intelligence (HII)" value={(hii.overallIntelligence * 100).toFixed(1) + '%'} trend="+1.2%" icon={BrainCircuit} />
        <MetricCard title="Mission Success Rate" value={(hii.metrics.missionSuccessRate * 100).toFixed(1) + '%'} trend="+0.5%" icon={Target} />
        <MetricCard title="Active Missions" value={metrics.activeMissions} trend={null} icon={Play} />
        <MetricCard title="HCNS Throughput" value={metrics.hcnsThroughput + ' ev/s'} trend="+120" icon={Activity} />
      </div>`;

const replacementCards = `<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Engine Status" value={metrics.engineStatus || "ONLINE"} trend={null} icon={Power} />
        <MetricCard title="Overall Intelligence (HII)" value={(hii.overallIntelligence * 100).toFixed(1) + '%'} trend="+1.2%" icon={BrainCircuit} />
        <MetricCard title="Mission Success Rate" value={(hii.metrics.missionSuccessRate * 100).toFixed(1) + '%'} trend="+0.5%" icon={Target} />
        <MetricCard title="Active Missions" value={metrics.activeMissions} trend={null} icon={Play} />
        <MetricCard title="Active Plans" value={metrics.activePlans || 0} trend={null} icon={ListTree} />
        <MetricCard title="HCNS Throughput" value={metrics.hcnsThroughput + ' ev/s'} trend="+120" icon={Activity} />
      </div>`;

code = code.replace(targetCards, replacementCards);
fs.writeFileSync(path, code);
console.log('patched');
