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

export class StrategyEventBus {
    private static instance: StrategyEventBus;
    private listeners: Record<string, ((data: any) => void)[]> = {};

    private constructor() {}

    public static getInstance(): StrategyEventBus {
        if (!StrategyEventBus.instance) {
            StrategyEventBus.instance = new StrategyEventBus();
        }
        return StrategyEventBus.instance;
    }

    public subscribe(event: StrategyEvents, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public publish(event: StrategyEvents, data: any) {
        console.log(`[HESO Event] ${event}`, data);
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}
