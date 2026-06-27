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
      let hecsData = undefined;
      const exp = normalizedData.raw.hcc_state_after?.experience_summary;
      if (exp) {
          hecsData = {
              Experience_Created: true,
              Experience_ID: exp.experience_id,
              Quality_Score: exp.quality_score,
              Extracted_Lessons: exp.lessons || [],
              Detected_Mistakes: exp.mistakes || [],
              Reusable_Patterns: exp.reusable_patterns || [],
              Related_Experiences: exp.related_experiences || [],
              Transferable_Skills: exp.transferable_skills || [],
              Reflection_Result: exp.reflection_result,
              Retrieved_Skills_For_Mission: normalizedData.raw.hcc_state_after?.retrieved_skills || [],
              Retrieved_Strategies_For_Mission: normalizedData.raw.hcc_state_after?.retrieved_strategies || [],
              Cross_Domain_Transfers_For_Mission: normalizedData.raw.hcc_state_after?.cross_domain_transfers || [],
              Retrieved_Abstractions_For_Mission: normalizedData.raw.hcc_state_after?.retrieved_abstractions || [],
              New_Abstractions_Created: normalizedData.raw.hcc_state_after?.recent_abstractions || [],
              Total_Abstractions: normalizedData.raw.hcc_state_after?.abstraction_count || 0,
              HKES_Patterns_Created: normalizedData.raw.hcc_state_after?.hkes_patterns_created || false,
              Recent_Patterns: normalizedData.raw.hcc_state_after?.recent_patterns || [],
              Total_Patterns: normalizedData.raw.hcc_state_after?.pattern_count || 0,
              HKES_Heuristics_Created: normalizedData.raw.hcc_state_after?.new_heuristics_created || false,
              Recent_Heuristics: normalizedData.raw.hcc_state_after?.recent_heuristics || [],
              Relevant_Heuristics_Used: normalizedData.raw.hcc_state_after?.relevant_heuristics || [],
              Heuristic_Conflicts: normalizedData.raw.hcc_state_after?.heuristic_conflicts || [],
              HKES_Causal_Models_Created: normalizedData.raw.hcc_state_after?.new_causal_models_created || false,
              Recent_Causal_Models: normalizedData.raw.hcc_state_after?.recent_causal_models || [],
              Relevant_Causal_Models_Used: normalizedData.raw.hcc_state_after?.relevant_causal_models || [],
              Causal_Conflicts: normalizedData.raw.hcc_state_after?.causal_conflicts || []
          };
          
          let hcwData = undefined;
          if (normalizedData.raw.hcc_state_after?.current_workspace_id) {
              try {
                  const { CognitiveWorkspace } = require('./hcw/cognitive_workspace.js');
                  const metrics = CognitiveWorkspace.getWorkspaceMetrics(normalizedData.raw.hcc_state_after.current_workspace_id);
                  const ws = CognitiveWorkspace.getWorkspace(normalizedData.raw.hcc_state_after.current_workspace_id);
                  if (ws) {
                      hcwData = {
                          workspace_id: ws.workspace_id,
                          metrics,
                          modules_contributed: ws.modules_contributed,
                          patches: ws.patches
                      };
                  }
              } catch(e) {
                  // ignore
              }
          }
          
          try {
              const { CompetenceProfileManager } = require('./hecs/competence_profile.js');
              const profile = CompetenceProfileManager.getProfile();
              (hecsData as any).Competence_Profile = {
                  domain_strengths: profile.strengths.filter((s: string) => s.startsWith("domain:")),
                  domain_weaknesses: profile.weaknesses.filter((s: string) => s.startsWith("domain:")),
                  capability_scores: profile.cognitive_capability_competence,
                  recent_changes: profile.change_log.slice(-5)
              };
          } catch (e) {
              // Ignore if not initialized
          }
      }
      return {
        ...baseReport,
        evidence_summary: strategicRecommendation.evidence_summary || [],
        hecs_data: hecsData,
        hcw_data: hcwData,
        technical_appendix: "See developer debug data for all outputs.",
        developer_debug_data: normalizedData.raw
      };
    }

    // In user mode, only include top evidence if useful
    if (strategicRecommendation.evidence_summary && strategicRecommendation.evidence_summary.length > 0) {
        // filter out system-generated items if possible, or just take the top 3
        const usefulEvidence = strategicRecommendation.evidence_summary.filter((e: any) => e.relevance > 70 || e.relevance_score > 70 || e.title).slice(0, 3);
        if (usefulEvidence.length > 0) {
             (baseReport as any).top_evidence = usefulEvidence;
        }
    }

    return baseReport;
  }
}

