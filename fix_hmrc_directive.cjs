const fs = require('fs');
let code = fs.readFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', 'utf8');

const updatedFinalize = `    private finalizeMission(event: any, missionId: string) {
        const ctx = this.getContext(missionId);
        const status = event.type === "MISSION_COMPLETED" ? "SUCCESS" : "FAILED";
        
        const firstEvent = ctx.timeline && ctx.timeline.length > 0 ? ctx.timeline[0].timestamp : Date.now();
        const duration = Date.now() - firstEvent;
        
        // Extract mission info directly
        let directive = ctx.mission?.directive || ctx.mission?.name || ctx.mission?.missionDirective || "";
        let objective = ctx.mission?.objective || ctx.mission?.description || "";
        
        if (!directive || !objective) {
            // Look through observations and other events for directive
            for (const obs of ctx.observations) {
                if (!directive) directive = obs.directive || obs.missionDirective || obs.goal?.name || "";
                if (!objective) objective = obs.objective || obs.goal?.description || obs.goal?.name || "";
            }
        }
        
        if (!directive) directive = "Unknown Directive";
        if (!objective) objective = "Unknown Objective";`;

code = code.replace(/    private finalizeMission\(event: any, missionId: string\) \{[\s\S]*?let objective = ctx\.mission\?\.objective \|\| ctx\.mission\?\.description \|\| "";/, updatedFinalize);

fs.writeFileSync('src/server/core/hmrc1/managers/MissionResultManager.ts', code);
console.log("Updated directive extraction");
