const fs = require('fs');

let path9 = 'src/server/core/pipeline/phase2_mission_pipeline.ts';
if (fs.existsSync(path9)) {
    let code9 = fs.readFileSync(path9, 'utf8');
    code9 = code9.replace(/as ISpecialist/g, ''); // cleanup any previous just in case
    code9 = code9.replace(/arbitrator\.registerSpecialist\((.*?)\)/g, 'arbitrator.registerSpecialist($1 as any)');
    fs.writeFileSync(path9, code9);
}

