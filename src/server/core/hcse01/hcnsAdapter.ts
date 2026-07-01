import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { CognitiveEvent, CognitiveDomain, EventPriority } from "../hcns01/types.js";
import { SocietyState } from "./types.js";

export class HCNSAdapter {
    private mesh: HyperMindEventMesh;

    constructor() {
        this.mesh = HyperMindEventMesh.getInstance();
        
        if (!this.mesh.registry.isRegistered("SOCIETY_STATE_TRANSITION")) {
            this.mesh.registerEventType({
                type: "SOCIETY_STATE_TRANSITION",
                domain: CognitiveDomain.SYSTEM,
                description: "Cognitive Society State Transition"
            });
        }
        if (!this.mesh.registry.isRegistered("SESSION_CREATED")) {
            this.mesh.registerEventType({
                type: "SESSION_CREATED",
                domain: CognitiveDomain.SYSTEM,
                description: "Cognitive Session Created"
            });
        }
    }

    public async publishStateTransition(oldState: SocietyState, newState: SocietyState): Promise<void> {
        this.mesh.publish({
            type: "SOCIETY_STATE_TRANSITION",
            domain: CognitiveDomain.SYSTEM,
            priority: EventPriority.HIGH,
            source: "HCSE-01",
            payload: { oldState, newState }
        });
    }

    public publishSessionCreated(sessionId: string, goals: string[]): void {
        this.mesh.publish({
            type: "SESSION_CREATED",
            domain: CognitiveDomain.SYSTEM,
            priority: EventPriority.NORMAL,
            source: "HCSE-01",
            payload: { sessionId, goals }
        });
    }

    public subscribe(topic: string, handler: (event: CognitiveEvent) => Promise<void> | void): string {
        return this.mesh.subscribe(topic, handler);
    }

    public unsubscribe(subscriptionId: string): void {
        this.mesh.unsubscribe(subscriptionId);
    }
}
