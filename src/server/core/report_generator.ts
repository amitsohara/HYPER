export class ReportGenerator {
  static generateReport(normalizedData: any, sections: any, strategicRecommendation: any, viewMode: string): any {
    const baseReport = {
      mission_id: normalizedData.raw.mission_id || "unknown",
      mission: normalizedData.mission,
      mission_type: sections.mission_type,
      mission_stage: sections.mission_stage,
      status: "Mission Completed",
      recommended_strategy: strategicRecommendation.best_strategy?.description || strategicRecommendation.best_strategy?.id,
      why_this_strategy: strategicRecommendation.reason,
      confidence_score: strategicRecommendation.confidence,
      confidence_reasoning: strategicRecommendation.confidence_reasoning,
      uncertainty: strategicRecommendation.uncertainty,
      top_alternatives: Object.values(strategicRecommendation.alternatives || {}).map((a: any) => a?.description || a?.id),
      assumptions: strategicRecommendation.assumptions,
      tradeoffs: strategicRecommendation.tradeoffs,
      
      // SDE Extracted Fields
      estimated_success_probability: sections.estimated_success_probability,
      overall_risk_level: sections.overall_risk_level,
      executive_summary: "Our recommended strategy is... " + (strategicRecommendation.best_strategy?.description || ""),
      roadmap: sections.roadmap,
      research_findings: sections.research_findings,
      simulation_summary: sections.simulation_summary,
      
      budget_and_resources: strategicRecommendation.estimated_cost || sections.budget_and_resources,
      estimated_timeline: strategicRecommendation.estimated_timeline,
      
      risks_and_mitigations: strategicRecommendation.key_risks?.join("\\n") || sections.risks_and_mitigations,
      
      // Imagination & Unknowns
      imagined_world_summary: normalizedData.raw.imagination?.imagined_world?.world_name ? `${normalizedData.raw.imagination.imagined_world.world_name} - ${normalizedData.raw.imagination.imagined_world.environment}` : null,
      counterfactual_insights: normalizedData.raw.imagination?.counterfactuals,
      unknown_solutions: normalizedData.raw.imagination?.unknown_solution,

      weekly_action_plan: sections.weekly_action_plan,
      investor_or_stakeholder_strategy: sections.investor_or_stakeholder_strategy,
      key_decisions: sections.key_decisions,
      recommended_next_actions: sections.recommended_next_actions,
      next_recommended_mission: sections.next_recommended_mission,
      decision_trace: strategicRecommendation.decision_trace,
      tokens_used: normalizedData.raw.tokens_used,
      token_savings: normalizedData.raw.token_savings,
      estimated_cost: normalizedData.raw.estimated_cost,
      modules_used: normalizedData.raw.modules_used,
      modules_skipped: normalizedData.raw.modules_skipped,
      modules_failed: normalizedData.raw.modules_failed || []
    };

    if (viewMode === "developer") {
      return {
        ...baseReport,
        technical_appendix: "See developer debug data for all outputs.",
        developer_debug_data: normalizedData.raw
      };
    }

    return baseReport;
  }
}

