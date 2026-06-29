import { ObservatoryDashboard } from "./observabilityTypes.js";
import { ObservatoryQueryEngine } from "./queryEngine.js";
import { ObservabilityEventBus, ObservabilityEvents } from "./observabilityEvents.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class DashboardGenerator {
    private queryEngine: ObservatoryQueryEngine;
    private eventBus = ObservabilityEventBus.getInstance();

    constructor(queryEngine: ObservatoryQueryEngine) {
        this.queryEngine = queryEngine;
    }

    public generateDashboard(targetAudience: any): ObservatoryDashboard {
        const health = this.queryEngine.executeQuery("CURRENT_HEALTH");
        const bottlenecks = this.queryEngine.executeQuery("CURRENT_BOTTLENECKS");

        const dashboard: ObservatoryDashboard = {
            dashboard_id: uuidv4(),
            target_audience: targetAudience,
            panels: [
                {
                    title: "Overall Cognitive Health",
                    type: "METRIC",
                    data: health.overall_health_score
                },
                {
                    title: "Active Bottlenecks",
                    type: "LIST",
                    data: bottlenecks
                }
            ],
            generated_at: Date.now()
        };

        this.eventBus.publish(ObservabilityEvents.DASHBOARD_GENERATED, { dashboard });
        return dashboard;
    }
}
