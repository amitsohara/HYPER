import { GoogleGenAI } from "@google/genai";
import { ModuleResultNormalizer } from "./module_result_normalizer.js";
import { MissionSectionsBuilder } from "./mission_sections_builder.js";
import { ReportGenerator } from "./report_generator.js";
import { StrategicDecisionEngine } from "./strategic_decision_engine.js";

export class MissionCompiler {
  static async compile(ai: GoogleGenAI, rawMissionResult: any, options: { viewMode: string } = { viewMode: "user" }): Promise<any> {
    try {
      const normalizedData = ModuleResultNormalizer.normalize(rawMissionResult);
      const sections = await MissionSectionsBuilder.build(ai, normalizedData);
      
      // Pass data through Strategic Decision Engine
      const strategicRecommendation = await StrategicDecisionEngine.evaluate(ai, normalizedData.mission, rawMissionResult);
      
      // Generate Executive Report using SDE results instead of raw sections
      return ReportGenerator.generateReport(normalizedData, sections, strategicRecommendation, options.viewMode);
    } catch (e) {
      console.warn("MissionCompiler failed:", e);
      return {
        mission_id: rawMissionResult.mission_id || "unknown",
        mission: rawMissionResult.mission || rawMissionResult.mission_text || "Unknown",
        status: "Mission Completed (Compiler Error)",
        technical_appendix: "Error compiling full report.",
        developer_debug_data: rawMissionResult
      };
    }
  }
}

