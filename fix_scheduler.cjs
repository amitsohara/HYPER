const fs = require('fs');

let mgr = fs.readFileSync('src/server/core/hos1/managers/MissionManagers.ts', 'utf8');

const updatedSchedule = `    schedule(context: MissionContext): MissionExecution {
        const execution: MissionExecution = {
            id: \`exec-\${uuidv4()}\`,
            missionId: context.id,
            status: "QUEUED",
            context,
            startTime: Date.now()
        };
        this.queue.enqueue(execution);

        this.eventMesh.publish({
            type: "MISSION_SCHEDULED",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            source: "HOS_SCHEDULER",
            payload: { 
                missionId: context.id,
                missionName: context.name,
                directive: context.directive,
                objective: context.objective,
                execution 
            }
        });

        return execution;
    }`;

mgr = mgr.replace(/    schedule\(context: MissionContext\): MissionExecution \{[\s\S]*?return execution;\n    \}/, updatedSchedule);

fs.writeFileSync('src/server/core/hos1/managers/MissionManagers.ts', mgr);
console.log("Updated Scheduler");
