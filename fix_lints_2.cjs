const fs = require('fs');

// 1. src/server/core/hcce1/conceptDiscoveryEngine.ts
let path1 = 'src/server/core/hcce1/conceptDiscoveryEngine.ts';
if (fs.existsSync(path1)) {
    let code1 = fs.readFileSync(path1, 'utf8');
    code1 = code1.replace(/entity\.properties/g, '(entity as any).properties');
    fs.writeFileSync(path1, code1);
}

// 3. src/server/core/hila1/core/IntelligenceArbitrator.ts
let path3 = 'src/server/core/hila1/core/IntelligenceArbitrator.ts';
if (fs.existsSync(path3)) {
    let code3 = fs.readFileSync(path3, 'utf8');
    code3 = code3.replace(/publishEvent\(\{([\s\S]*?)\}\)/g, function(match, p1) {
        if (!p1.includes('domain:')) {
            let res = match.replace(/\}$/, ', domain: "HILA", priority: "HIGH"}');
            return res;
        }
        return match;
    });
    fs.writeFileSync(path3, code3);
}

// 4. src/server/core/hila1/engines/ContextAssembler.ts
let path4 = 'src/server/core/hila1/engines/ContextAssembler.ts';
if (fs.existsSync(path4)) {
    let code4 = fs.readFileSync(path4, 'utf8');
    code4 = code4.replace(/from '\.\.\/\.\.\/heam1\/memoryManager\.js'/g, `from '../../hwme1/index.js'`);
    code4 = code4.replace(/from '\.\.\/\.\.\/heam1\/memoryManager'/g, `from '../../hwme1/index.js'`);
    fs.writeFileSync(path4, code4);
}

// 6. src/server/core/hila1/providers/GeminiProvider.ts
let path6 = 'src/server/core/hila1/providers/GeminiProvider.ts';
if (fs.existsSync(path6)) {
    let code6 = fs.readFileSync(path6, 'utf8');
    code6 = code6.replace(/String\(\)/g, 'String');
    fs.writeFileSync(path6, code6);
}

// 7. src/server/core/hre1/hreSpecialist.ts
let path7 = 'src/server/core/hre1/hreSpecialist.ts';
if (fs.existsSync(path7)) {
    let code7 = fs.readFileSync(path7, 'utf8');
    code7 = code7.replace(/timestamp: number;/g, 'timestamp: number; provenance?: any;');
    fs.writeFileSync(path7, code7);
}

console.log("Fixed lints 2");
