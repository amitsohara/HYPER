const fs = require('fs');
const glob = require('glob'); // maybe not available, use walk
const path = require('path');

function fixFile(filePath) {
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Replace JSON.parse(fs.readFileSync(...)) with a safe version
    code = code.replace(/return JSON\.parse\(fs\.readFileSync\(DB_PATH, 'utf8'\)\);/g, 
        `try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { return Array.isArray(JSON.parse('[]')) && filePath.includes('evidence') ? [] : {}; }`);
    
    // Replace const existing = JSON.parse(fs.readFileSync(...))
    code = code.replace(/const existing = JSON\.parse\(fs\.readFileSync\(DB_PATH, 'utf8'\)\);/g,
        `let existing = []; try { existing = JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { existing = []; }`);

    // For competence_tracker.ts
    code = code.replace(/try \{ return JSON\.parse\(fs\.readFileSync\(DB_PATH, 'utf8'\)\); \} catch\(e\) \{ return Array\.isArray\(JSON\.parse\('\[\]'\)\) && filePath\.includes\('evidence'\) \? \[\] : \{\}; \}/g,
        `try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch(e) { return {} as any; }`);

    fs.writeFileSync(filePath, code);
}

const filesToFix = [
    'src/server/core/knowledge/evidence_store.ts',
    'src/server/core/strategy_library.ts',
    'src/server/core/competence_tracker.ts'
];

for (const file of filesToFix) {
    if (fs.existsSync(file)) {
        fixFile(file);
    }
}
