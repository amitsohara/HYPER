import { GoogleGenAI } from "@google/genai";
import { EvidenceCollector } from "./evidence_collector.js";
import { OptionGenerator } from "./option_generator.js";
import { TradeoffAnalyzer } from "./tradeoff_analyzer.js";
import { AssumptionManager } from "./assumption_manager.js";
import { DecisionRanker } from "./decision_ranker.js";
import { ConfidenceCalculator } from "./confidence_calculator.js";
import { DecisionTrace } from "./decision_trace.js";
import { AlternativeGenerator } from "./alternative_generator.js";
import { RecommendationGenerator } from "./recommendation_generator.js";

export class StrategicDecisionEngine {
  static async evaluate(ai: GoogleGenAI, missionText: string, missionData: any): Promise<any> {
    const traceSteps: any[] = [];
    traceSteps.push({ name: "Mission Input", details: { missionText } });

    // Step 1: Collect Evidence
    const evidence = EvidenceCollector.collect(missionData);
    let realSources: string[] = [];
    evidence.forEach(e => {
       if (e.source === "Knowledge Acquisition" && Array.isArray(e.data)) {
           e.data.forEach((item: any) => {
               if (item.source || item.title) {
                   realSources.push(item.source || item.title);
               }
           });
       } else {
           realSources.push(e.source);
       }
    });
    
    traceSteps.push({ name: "Evidence Collection", details: { sources: realSources.length > 0 ? realSources : ["No specific sources found"] } });

    // Step 2: Generate Options
    let options = await OptionGenerator.generate(ai, missionText, evidence);
    traceSteps.push({ name: "Option Generation", details: { num_options: options.length } });

    if (!options || options.length === 0) {
      options = [{ id: "fallback", description: "Fallback strategy", expected_outcome: "Unknown" }];
    }

    // Step 3: Tradeoff Analysis
    const tradeoffs = await TradeoffAnalyzer.analyze(ai, options);
    traceSteps.push({ name: "Tradeoff Analysis" });

    // Step 4: Assumption Analysis
    const assumptions = await AssumptionManager.extract(ai, options);
    traceSteps.push({ name: "Assumption Analysis" });

    // Step 5 & 6: Evidence Weighting & Decision Ranking
    const rankings = await DecisionRanker.rank(ai, missionText, options, tradeoffs);
    traceSteps.push({ name: "Decision Ranking", details: { top_choice: rankings[0]?.id } });

    const topRanking = rankings[0];
    const topOption = options.find(o => o.id === topRanking?.id) || options[0];

    // Step 7: Confidence
    const confidenceData = await ConfidenceCalculator.calculate(ai, missionText, topOption, evidence);
    traceSteps.push({ name: "Confidence Calculation", details: { score: confidenceData.confidence_score } });

    // Step 8 & 9: Alternatives & Decision Trace
    const alternatives = AlternativeGenerator.generate(options, rankings);
    traceSteps.push({ name: "Alternatives Generated" });

    const decision_trace = DecisionTrace.generate(traceSteps);

    // Step 10: Final Recommendation
    return RecommendationGenerator.generate({
      best_strategy: topOption,
      reason: topRanking?.reason || "Best overall score based on tradeoffs.",
      confidenceData,
      assumptions: assumptions[topOption.id] || [],
      tradeoffs: tradeoffs[topOption.id] || {},
      alternatives,
      evidence_summary: evidence,
      decision_trace
    });
  }
}
