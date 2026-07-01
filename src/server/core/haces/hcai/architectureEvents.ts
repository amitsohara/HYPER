import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../../hcns01/index.js";

export enum ArchitectureEvents {
    BLUEPRINT_CREATED = "BlueprintCreated",
    BLUEPRINT_APPROVED = "BlueprintApproved",
    BLUEPRINT_REJECTED = "BlueprintRejected",
    ARCHITECTURE_DESIGNED = "ArchitectureDesigned",
    ARCHITECTURE_ALTERNATIVE_GENERATED = "ArchitectureAlternativeGenerated",
    ARCHITECTURE_SIMULATED = "ArchitectureSimulated",
    DEPENDENCY_UPDATED = "DependencyUpdated",
    ARCHITECTURE_REVIEWED = "ArchitectureReviewed",
    ENGINEERING_PACKAGE_GENERATED = "EngineeringPackageGenerated",
    ARCHITECTURE_GENOME_UPDATED = "ArchitectureGenomeUpdated"
}

export type EventCallback = (payload: any) => void;

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(ArchitectureEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.PLANNING, // Architecture falls under planning / execution
            description: `Architecture Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class ArchitectureEventBus {
    private static instance: ArchitectureEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): ArchitectureEventBus {
        if (!ArchitectureEventBus.instance) {
            ArchitectureEventBus.instance = new ArchitectureEventBus();
        }
        return ArchitectureEventBus.instance;
    }

    public subscribe(event: ArchitectureEvents, callback: EventCallback) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: ArchitectureEvents, payload: any) {
        console.log(`[HCNS-01] [HCAI] Publishing: ${event}`);
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.PLANNING,
            priority: EventPriority.NORMAL,
            source: "HCAI",
            payload: payload
        });
    }
}

