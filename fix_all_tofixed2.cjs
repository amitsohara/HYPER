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

            const matches = code.match(/[^({[\s]*?\.toFixed\(.*?\)/g);
            if (matches) {
                // console.log(`In ${fullPath}:`, matches);
            }
        }
    }
}
processDir('./src/components');
