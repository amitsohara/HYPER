import { v4 as uuidv4 } from "uuid";
import { ExecutiveDashboard } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { StrategyMetrics } from "./strategyMetrics.js";

export class ExecutiveDecisionSupport {
    private eventBus = StrategyEventBus.getInstance();

    public generateDashboard(intelligenceData: any, risks: any[], priorities: string[]): ExecutiveDashboard {
        const dashboard: ExecutiveDashboard = {
            dashboard_id: uuidv4(),
            timestamp: Date.now(),
            current_intelligence_profile: intelligenceData.profile || {},
            evolution_velocity: intelligenceData.velocity || 0,
            research_productivity: intelligenceData.research_productivity || 0,
            engineering_productivity: intelligenceData.engineering_productivity || 0,
            long_term_risks: risks.map(r => r.description),
            strategic_priorities: priorities
        };

        StrategyMetrics.dashboards_published++;
        this.eventBus.publish(StrategyEvents.EXECUTIVE_DASHBOARD_PUBLISHED, dashboard);

        return dashboard;
    }
}
