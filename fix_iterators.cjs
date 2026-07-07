const fs = require('fs');

function fixIter(file, search, repl) {
    if (fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        code = code.replace(search, repl);
        fs.writeFileSync(file, code);
    }
}

fixIter('src/server/core/hcce1/conceptDiscoveryEngine.ts', 
        'for (const [id, entity] of canonical.entities.entries())', 
        'for (const [id, entity] of Array.from(canonical.entities.entries()))');

