export class ModuleResultNormalizer {
  static normalize(rawMissionResult: any): any {
    return {
      mission: rawMissionResult.mission || rawMissionResult.mission_text || "Unknown Mission",
      beliefs: rawMissionResult.beliefs || [],
      goals: rawMissionResult.goals || [],
      plan: rawMissionResult.plan || rawMissionResult.action?.plan || [],
      social_cognition: rawMissionResult.social_cognition || {},
      world_model: rawMissionResult.world_model || rawMissionResult.imagination?.imagined_world || {},
      imagination: rawMissionResult.imagination || {},
      simulation_summary: rawMissionResult.digital_twin || rawMissionResult.prediction || {},
      scientific_discovery: rawMissionResult.scientific_discovery || {},
      final_report: rawMissionResult.final_report || "",
      recommendation: rawMissionResult.recommendation || rawMissionResult.decision || {},
      executive_planning: rawMissionResult.executive_planning || {},

      raw: rawMissionResult
    };
  }
}
