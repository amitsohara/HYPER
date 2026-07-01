import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../../hcns01/index.js";

export enum StrategyEvents {
    ROADMAP_CREATED = "HESO_ROADMAP_CREATED",
    STRATEGY_UPDATED = "HESO_STRATEGY_UPDATED",
    INVESTMENT_REBALANCED = "HESO_INVESTMENT_REBALANCED",
    OPPORTUNITY_DISCOVERED = "HESO_OPPORTUNITY_DISCOVERED",
    STRATEGIC_RISK_DETECTED = "HESO_STRATEGIC_RISK_DETECTED",
    FUTURE_SCENARIO_GENERATED = "HESO_FUTURE_SCENARIO_GENERATED",
    CIVILIZATION_FORECAST_UPDATED = "HESO_CIVILIZATION_FORECAST_UPDATED",
    STRATEGY_RECOMMENDATION_GENERATED = "HESO_STRATEGY_RECOMMENDATION_GENERATED",
    EXECUTIVE_DASHBOARD_PUBLISHED = "HESO_EXECUTIVE_DASHBOARD_PUBLISHED",
    GOVERNANCE_PROPOSAL_PREPARED = "HESO_GOVERNANCE_PROPOSAL_PREPARED",
    GRAND_STRATEGY_FORMULATED = "HESO_GRAND_STRATEGY_FORMULATED"
}

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(StrategyEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.PLANNING, // Strategy is Planning
            description: `Strategy Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class StrategyEventBus {
    private static instance: StrategyEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): StrategyEventBus {
        if (!StrategyEventBus.instance) {
            StrategyEventBus.instance = new StrategyEventBus();
        }
        return StrategyEventBus.instance;
    }

    public subscribe(event: StrategyEvents, callback: (data: any) => void) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: StrategyEvents, data: any) {
        console.log(`[HCNS-01] [HESO] Publishing: ${event}`);
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.PLANNING,
            priority: EventPriority.NORMAL,
            source: "HESO",
            payload: data
        });
    }
}

