import { initHyperMindPlatform } from "./bootstrap.js";
import { HyperMindEventMesh } from "./src/server/core/hcns01/eventMesh.js";
import { CognitiveDomain } from "./src/server/core/hcns01/types.js";
import { v4 as uuidv4 } from "uuid";

async function run() {
    await initHyperMindPlatform();
    console.log("\n=====================\nSTARTING END-TO-END AUDIT\n=====================\n");
    
    const mesh = HyperMindEventMesh.getInstance();
    const trace: string[] = [];
    
    // Subscribe to all to watch the pipeline
    mesh.subscribe("*", (event) => {
        if (event.type !== "HOS_HEARTBEAT") {
            trace.push(`[${event.type}] from ${event.source}`);
            console.log(`>>> EVENT: ${event.type} from ${event.source}`);
        }
    });

    mesh.publish({
        type: "MISSION_SCHEDULED",
        domain: CognitiveDomain.SYSTEM,
        priority: 1,
        source: "HOS_SCHEDULER",
        payload: {
            execution: {
                id: `exec-${uuidv4()}`,
                missionId: `mis-${uuidv4()}`,
                status: "QUEUED",
                context: {
                    id: "mis-ctx",
                    priority: 10,
                    requiredCapabilities: [],
                    allocatedResources: []
                },
                startTime: Date.now()
            },
            timestamp: Date.now()
        }
    });

    // Wait a few seconds for the pipeline to finish
    await new Promise(r => setTimeout(r, 4000));
    console.log("\n=====================\nEND-TO-END PIPELINE TRACE\n=====================\n");
    trace.forEach(t => console.log(t));
    process.exit(0);
}
run();
