const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

code = code.replace(/agg\.confidenceBreakdown!\.perception = Math\.max\(0\.8, payload\.confidence \|\| 0\.95\);/, 'if (payload.confidence !== undefined) agg.confidenceBreakdown!.perception = payload.confidence;');
code = code.replace(/agg\.confidenceBreakdown!\.reasoning = Math\.max\(0\.85, payload\.confidence \|\| 0\.92\);/, 'if (payload.confidence !== undefined) agg.confidenceBreakdown!.reasoning = payload.confidence;');
code = code.replace(/agg\.confidenceBreakdown!\.planning = Math\.max\(0\.8, payload\.confidence \|\| payload\.plan\?\.confidence \|\| 0\.88\);/, 'if (payload.confidence !== undefined || payload.plan?.confidence !== undefined) agg.confidenceBreakdown!.planning = payload.confidence ?? payload.plan?.confidence;');
code = code.replace(/agg\.confidenceBreakdown!\.simulation = Math\.max\(0\.8, payload\.run\?\.outcome\?\.metrics\?\.confidence \|\| 0\.9\);/, 'if (payload.run?.outcome?.metrics?.confidence !== undefined || payload.confidence !== undefined) agg.confidenceBreakdown!.simulation = payload.run?.outcome?.metrics?.confidence ?? payload.confidence;');
code = code.replace(/agg\.confidenceBreakdown!\.execution = 0\.95;/, 'if (payload.confidence !== undefined) agg.confidenceBreakdown!.execution = payload.confidence;');
code = code.replace(/agg\.confidenceBreakdown!\.learning = 0\.92;/, 'if (payload.confidence !== undefined) agg.confidenceBreakdown!.learning = payload.confidence;');

const newAvgLogic = `        // Calculate dynamic overall confidence & score
        const cb = agg.confidenceBreakdown!;
        let totalConf = 0;
        let count = 0;
        for (const key of ['perception', 'reasoning', 'planning', 'simulation', 'execution', 'learning']) {
            const val = (cb as any)[key];
            if (val > 0) {
                totalConf += val;
                count++;
            }
        }
        cb.overall = count > 0 ? totalConf / count : 0;`;

code = code.replace(/\s*\/\/ Calculate dynamic overall confidence & score\s*const cb = agg\.confidenceBreakdown!;\s*const avgConf = \(cb\.perception \+ cb\.reasoning \+ cb\.planning \+ cb\.simulation \+ cb\.execution \+ cb\.learning\) \/ 6;\s*cb\.overall = avgConf \|\| 0\.92;/, '\n' + newAvgLogic);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Updated confidence calculations");
