export enum ResearchEvents {
    RESEARCH_INITIATIVE_CREATED = "ResearchInitiativeCreated",
    RESEARCH_PRIORITY_UPDATED = "ResearchPriorityUpdated",
    WEAKNESS_DETECTED = "WeaknessDetected",
    TECHNOLOGY_DISCOVERED = "TechnologyDiscovered",
    GRAND_CHALLENGE_UPDATED = "GrandChallengeUpdated",
    ROADMAP_PUBLISHED = "RoadmapPublished",
    INVESTMENT_CHANGED = "InvestmentChanged",
    RECOMMENDATION_GENERATED = "RecommendationGenerated",
    RESEARCH_COMPLETED = "ResearchCompleted",
    RESEARCH_ARCHIVED = "ResearchArchived"
}

export type EventCallback = (payload: any) => void;

export class ResearchEventBus {
    private static instance: ResearchEventBus;
    private listeners: Map<ResearchEvents, EventCallback[]> = new Map();

    private constructor() {}

    public static getInstance(): ResearchEventBus {
        if (!ResearchEventBus.instance) {
            ResearchEventBus.instance = new ResearchEventBus();
        }
        return ResearchEventBus.instance;
    }

    public subscribe(event: ResearchEvents, callback: EventCallback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
    }

    public publish(event: ResearchEvents, payload: any) {
        const callbacks = this.listeners.get(event) || [];
        callbacks.forEach(cb => cb(payload));
    }
}
