export enum GapEvents {
    GAP_DETECTED = "GapDetected",
    GAP_CLASSIFIED = "GapClassified",
    CAPABILITY_REUSED = "CapabilityReused",
    CAPABILITY_PROPOSED = "CapabilityProposed",
    CAPABILITY_REJECTED = "CapabilityRejected",
    CAPABILITY_PRIORITIZED = "CapabilityPrioritized",
    CAPABILITY_ROADMAP_UPDATED = "CapabilityRoadmapUpdated",
    IMPACT_PREDICTION_GENERATED = "ImpactPredictionGenerated",
    EVOLUTION_RECOMMENDATION_CREATED = "EvolutionRecommendationCreated",
    CAPABILITY_GENOME_UPDATED = "CapabilityGenomeUpdated"
}

export type EventCallback = (payload: any) => void;

export class GapEventBus {
    private static instance: GapEventBus;
    private listeners: Map<GapEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): GapEventBus {
        if (!GapEventBus.instance) {
            GapEventBus.instance = new GapEventBus();
        }
        return GapEventBus.instance;
    }

    public subscribe(event: GapEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: GapEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
