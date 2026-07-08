const fs = require('fs');

const extractJson = `function cleanJson(str) {
    if (!str) return "{}";
    const match = str.match(/\`\`\`(?:json)?([\\s\\S]*?)\`\`\`/);
    return match ? match[1].trim() : str.trim();
}`;

function patchFile(path) {
    if (!fs.existsSync(path)) return;
    let code = fs.readFileSync(path, 'utf8');
    if (!code.includes('function cleanJson')) {
        // Insert it after imports
        code = code.replace(/^(import.*?;?\n)+/m, match => match + "\n" + extractJson + "\n");
    }
    
    // Replace the ugly try catch JSON.parse with a clean one using cleanJson
    code = code.replace(
        /let parsed: any = \{\}; try \{ parsed = \(function\(\)\{ try \{ return JSON\.parse\(response\.content\); \} catch\(e\) \{ return \[\] as any; \} \}\)\(\); \} catch\(e\) \{ console\.warn\("Failed to parse LLM response", response\.content\); \}/g,
        'let parsed: any = {}; try { parsed = JSON.parse(cleanJson(response.content)); } catch(e) { console.warn("Failed to parse LLM response", response.content); }'
    );
    
    fs.writeFileSync(path, code);
}

patchFile('src/server/core/hdme1/engines/ActionAuthorizationEngine.ts');
patchFile('src/server/core/hste1/SimulationEngine.ts');
console.log("Patched JSON parsing in HDME and HSTE");
