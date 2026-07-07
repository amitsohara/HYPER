const fs = require('fs');

const path = 'src/components/MissionControlApp.tsx';
let code = fs.readFileSync(path, 'utf8');

// LiveInputsView
code = code.replace(
    /const \[inputs, setInputs\] = useState\(\[\s+.*?\s+\]\);/s,
    'const [inputs, setInputs] = useState<any[]>([]);'
);

// MissionBuilderView
code = code.replace(
    /const \[nodes, setNodes\] = useState<\{id: string, type: string, label: string, icon: any\}\[]>\(\[\s+.*?\s+\]\);/s,
    'const [nodes, setNodes] = useState<{id: string, type: string, label: string, icon: any}[]>([]);'
);

fs.writeFileSync(path, code);
