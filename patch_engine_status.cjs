const fs = require('fs');

const path = 'src/components/mission/EngineStatusView.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /const \[engines, setEngines\] = useState\(\[\s+.*?\s+\]\);/s,
    'const [engines, setEngines] = useState<any[]>([]);\n\n    useEffect(() => {\n        if (metrics?.engineStats) {\n            setEngines(metrics.engineStats);\n        }\n    }, [metrics]);'
);

code = code.replace(
    /\/\/ Simulate some gentle live variations[\s\S]*?\}, \[\]\);/,
    ''
);

fs.writeFileSync(path, code);
