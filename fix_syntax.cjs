const fs = require('fs');

function fixSyntax(file) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(
        `v2.0 HII: {hii?.overallIntelligence ? (Number(hii.overallIntelligence * 100).toFixed(1) + '%' : 'CALCULATING...'}`,
        `v2.0 HII: {hii?.overallIntelligence ? Number(hii.overallIntelligence * 100).toFixed(1) + '%' : 'CALCULATING...'}`
    );
    code = code.replace(
        `HII: {hii?.overallIntelligence ? (Number(hii.overallIntelligence * 100).toFixed(1) + '%' : '...'}`,
        `HII: {hii?.overallIntelligence ? Number(hii.overallIntelligence * 100).toFixed(1) + '%' : '...'}`
    );
    fs.writeFileSync(file, code);
}

fixSyntax('src/components/MissionControlApp.tsx');
fixSyntax('src/components/HMCCApp.tsx');
