export class RecommendationGenerator {
  static generate(data: {
    best_strategy: any;
    reason: string;
    confidenceData: any;
    assumptions: any;
    tradeoffs: any;
    alternatives: any;
    evidence_summary: any[];
    decision_trace: any[];
  }): any {
    return {
      best_strategy: data.best_strategy,
      reason: data.reason,
      confidence: data.confidenceData.confidence_score,
      confidence_reasoning: data.confidenceData.confidence_reasoning,
      uncertainty: data.confidenceData.uncertainty,
      assumptions: data.assumptions,
      tradeoffs: data.tradeoffs,
      alternatives: data.alternatives,
      expected_outcomes: data.best_strategy?.expected_outcome,
      estimated_cost: data.best_strategy?.estimated_resources,
      estimated_timeline: data.best_strategy?.estimated_timeline,
      key_risks: data.best_strategy?.key_risks,
      mitigation: data.best_strategy?.mitigation || [],
      evidence_summary: data.evidence_summary.map(e => {
          if (e.source === "Knowledge Acquisition" && Array.isArray(e.data)) {
              return e.data.map((item: any) => ({
                  title: item.title,
                  source: item.source,
                  summary: item.summary,
                  relevance: item.relevance_score
              }));
          }
          return { source: e.source, data: "System generated insight" };
      }).flat(),
      decision_trace: data.decision_trace
    };
  }
}
