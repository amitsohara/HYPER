import { GoogleGenAI } from "@google/genai";
import { ModuleResultNormalizer } from "./module_result_normalizer.js";
import { MissionSectionsBuilder } from "./mission_sections_builder.js";
import { ReportGenerator } from "./report_generator.js";
import { StrategicDecisionEngine } from "./strategic_decision_engine.js";
import { DomainCompilerFactory } from "./domain_compilers.js";

export class MissionCompiler {
  static async compile(ai: GoogleGenAI, rawMissionResult: any, options: { viewMode: string } = { viewMode: "user" }): Promise<any> {
    try {
      const normalizedData = ModuleResultNormalizer.normalize(rawMissionResult);
      
      // Get mission type from Meta-Cognition Engine
      const metaMissionType = rawMissionResult?.meta_cognition?.understanding?.mission_type || "general";
      
      // Dynamically select report template classification based on Meta-Cognition type
      let templateType = "general";
      const lowerType = metaMissionType.toLowerCase();
      if (lowerType.includes("science") || lowerType.includes("research")) {
        templateType = "research";
      } else if (lowerType.includes("government") || lowerType.includes("social") || lowerType.includes("humanitarian") || lowerType.includes("geopolitical") || lowerType.includes("war") || lowerType.includes("impact")) {
        templateType = "government";
      } else if (lowerType.includes("manufacturing")) {
        templateType = "manufacturing";
      } else if (lowerType.includes("software") || lowerType.includes("technical") || lowerType.includes("engineering")) {
        templateType = "software";
      } else if (lowerType.includes("business") || lowerType.includes("startup") || lowerType.includes("commercial")) {
        templateType = "business";
      }

      normalizedData.classification = { type: templateType, stage: "execution", original_type: metaMissionType };
      
      // Use the dynamically selected Domain Compiler (Report Template)
      const domainCompiler = DomainCompilerFactory.getCompiler(templateType);
      const compiledSections = await domainCompiler.compile(ai, normalizedData);
      
      const sections = {
        ...compiledSections,
        mission_type: metaMissionType,
        mission_stage: "execution"
      };
      
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

