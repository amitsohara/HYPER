export const StrategyMetrics = {
    roadmaps_generated: 0,
    scenarios_simulated: 0,
    risks_detected: 0,
    opportunities_discovered: 0,
    recommendations_made: 0,
    dashboards_published: 0,

    getSummary() {
        return {
            roadmaps_generated: this.roadmaps_generated,
            scenarios_simulated: this.scenarios_simulated,
            risks_detected: this.risks_detected,
            opportunities_discovered: this.opportunities_discovered,
            recommendations_made: this.recommendations_made,
            dashboards_published: this.dashboards_published
        };
    }
};
