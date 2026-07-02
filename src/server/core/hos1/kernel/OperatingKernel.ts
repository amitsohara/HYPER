import { RuntimeState, RuntimeContext } from "../types.js";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { v4 as uuidv4 } from "uuid";
import { CognitiveDomain } from "../../hcns01/types.js";

export class OperatingKernel {
    private state: RuntimeState = RuntimeState.OFFLINE;
    private context: RuntimeContext;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.context = {
            id: `rt-${uuidv4()}`,
            state: this.state,
            startTime: Date.now(),
            activeMissions: 0
        };
    }

    async boot(): Promise<void> {
        // Register kernel events
        this.eventMesh.registerEventType({ type: "RUNTIME_STATE_CHANGED", domain: CognitiveDomain.SYSTEM, description: "HOS State change" });
        this.eventMesh.registerEventType({ type: "PLUGIN_LOADED", domain: CognitiveDomain.SYSTEM, description: "Plugin loaded" });
        this.eventMesh.registerEventType({ type: "MISSION_SCHEDULED", domain: CognitiveDomain.SYSTEM, description: "Mission scheduled" });

        this.transition(RuntimeState.BOOTING);
        console.log("HOS Kernel: Booting...");
        
        this.transition(RuntimeState.RUNNING);
        console.log("HOS Kernel: Running.");
    }

    async shutdown(): Promise<void> {
        this.transition(RuntimeState.SHUTTING_DOWN);
        console.log("HOS Kernel: Shutting down...");
        this.transition(RuntimeState.OFFLINE);
    }

    private transition(newState: RuntimeState) {
        this.state = newState;
        this.context.state = newState;
        
        this.eventMesh.publish({
            type: "RUNTIME_STATE_CHANGED",
            domain: CognitiveDomain.SYSTEM,
            priority: 1,
            source: "HOS_KERNEL",
            payload: { state: newState }
        });
    }

    getContext(): RuntimeContext {
        return this.context;
    }
}
