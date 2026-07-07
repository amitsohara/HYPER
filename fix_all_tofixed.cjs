const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let code = fs.readFileSync(fullPath, 'utf8');
            let changed = false;

            // MissionControlApp.tsx
            if (file === 'MissionControlApp.tsx') {
                if (code.includes('m.hii ? m.hii.toFixed(1)')) {
                    code = code.replace(/m\.hii \? m\.hii\.toFixed\(1\)/g, "m.hii ? Number(m.hii).toFixed(1)");
                    changed = true;
                }
                if (code.includes('m.llmDependency ? m.llmDependency.toFixed(2)')) {
                    code = code.replace(/m\.llmDependency \? m\.llmDependency\.toFixed\(2\)/g, "m.llmDependency ? Number(m.llmDependency).toFixed(2)");
                    changed = true;
                }
                if (code.includes('hii.overallIntelligence * 100).toFixed(1)')) {
                    code = code.replace(/hii\.overallIntelligence \* 100\)\.toFixed\(1\)/g, "Number(hii.overallIntelligence * 100).toFixed(1)");
                    changed = true;
                }
            }
            
            if (file === 'HMCCApp.tsx') {
                if (code.includes('hii.overallIntelligence * 100).toFixed(1)')) {
                    code = code.replace(/hii\.overallIntelligence \* 100\)\.toFixed\(1\)/g, "Number(hii.overallIntelligence * 100).toFixed(1)");
                    changed = true;
                }
            }

            if (changed) {
                fs.writeFileSync(fullPath, code);
                console.log(`Patched ${fullPath}`);
            }
        }
    }
}
processDir('./src/components');
