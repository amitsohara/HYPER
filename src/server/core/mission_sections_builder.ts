import { GoogleGenAI } from "@google/genai";
import { ExecutiveSummaryGenerator } from "./executive_summary_generator.js";
import { RiskBudgetExtractor } from "./risk_budget_extractor.js";
import { ActionPlanGenerator } from "./action_plan_generator.js";
import { MissionClassifier } from "./mission_classifier.js";
import { DomainCompilerFactory } from "./domain_compilers.js";

export class MissionSectionsBuilder {
  static async build(ai: GoogleGenAI, normalizedData: any): Promise<any> {
    // 1. Classify the mission
    const classification = await MissionClassifier.classify(ai, normalizedData.mission);
    normalizedData.classification = classification;

    // 2. Get Domain-Specific Compiler
    const domainCompiler = DomainCompilerFactory.getCompiler(classification.type);

    // 3. Generate adaptive sections
    const sections = await domainCompiler.compile(ai, normalizedData);

    return {
      ...sections,
      mission_type: classification.type,
      mission_stage: classification.stage,
    };
  }
}

