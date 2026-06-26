const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.ts') || file.endsWith('.py')) {
            results.push(file);
        }
    });
    return results;
}

const dirs = ['./src', './backend'];
let replacedCount = 0;
dirs.forEach(dir => {
    if(!fs.existsSync(dir)) return;
    const files = walkDir(dir);
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let changed = false;
        if (content.includes('gemini-2.0-flash')) {
            content = content.replace(/gemini-2.0-flash/g, 'gemini-flash-latest');
            changed = true;
        }
        if (content.includes('gemini-2.5-flash')) {
            content = content.replace(/gemini-2.5-flash/g, 'gemini-flash-latest');
            changed = true;
        }
        if (changed) {
            fs.writeFileSync(file, content);
            replacedCount++;
        }
    });
});
console.log('Replaced in ' + replacedCount + ' files.');
