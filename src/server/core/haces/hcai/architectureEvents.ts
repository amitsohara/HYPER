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

export class ArchitectureEventBus {
    private static instance: ArchitectureEventBus;
    private listeners: Map<ArchitectureEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): ArchitectureEventBus {
        if (!ArchitectureEventBus.instance) {
            ArchitectureEventBus.instance = new ArchitectureEventBus();
        }
        return ArchitectureEventBus.instance;
    }

    public subscribe(event: ArchitectureEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: ArchitectureEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
