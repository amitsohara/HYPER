import { GapMetrics, AnyGap, EvolutionRecommendation } from "./gapTypes.js";

export class GapMetricsCollector {
    public static collectMetrics(gaps: AnyGap[], recommendations: EvolutionRecommendation[]): GapMetrics {
        const rois = recommendations.map(r => r.cedm_result.selected_intervention.score);
        const average_roi = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0;

        return {
            total_gaps_detected: gaps.length,
            knowledge_gaps: gaps.filter(g => g.type === "KNOWLEDGE").length,
            capability_gaps: gaps.filter(g => g.type === "CAPABILITY").length,
            capabilities_reused: recommendations.filter(r => r.action_type === "REUSE_EXISTING_CAPABILITY").length,
            new_capabilities_proposed: recommendations.filter(r => r.action_type === "CREATE_NEW_CAPABILITY").length,
            average_roi
        };
    }
}
