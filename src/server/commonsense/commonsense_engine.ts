import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";
import { PersistentBrain } from "../brain/persistent_brain.js";

class PhysicalReasoner {
  static async evaluate(ai: GoogleGenAI, context: string) {
    return [];
  }
}
class SocialReasoner {
  static async evaluate(ai: GoogleGenAI, context: string) {
    return [];
  }
}
class TemporalReasoner {
  static async evaluate(ai: GoogleGenAI, context: string) {
    return [];
  }
}
class ConstraintEngine {
  static async evaluate(ai: GoogleGenAI, context: string) {
    return [];
  }
}

export class CommonSenseEngine {
  static async analyze(
    ai: GoogleGenAI,
    mission_text: string,
    current_plan?: any,
  ) {
    try {
      const prompt = `Analyze this mission and proposed plan against fundamental common-sense principles (physical laws, social norms, temporal realities, resource constraints).
Mission: "${mission_text}"
Plan: ${JSON.stringify(current_plan || "No specific plan yet")}

Identify any violated assumptions, impossible steps, flagged contradictions, and basic common-sense rules that must be respected.

Return JSON:
{
  "common_sense_rules": ["Rule 1", "Rule 2"],
  "impossible_plans": ["Action 1 is impossible because..."],
  "contradictions_flagged": ["Contradiction 1"],
  "violated_assumptions": ["Assumption 1 is invalid"]
}`;
      const res = await generateWithRetry(ai, {
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });
      const data = await cleanJSON(res?.text || "{}", ai);

      const common_sense_rules = data.common_sense_rules || [];
      const impossible_plans = data.impossible_plans || [];
      const contradictions_flagged = data.contradictions_flagged || [];
      const violated_assumptions = data.violated_assumptions || [];

      await PersistentBrain.storeEpisodicMemory({
        timestamp: new Date().toISOString(),
        type: "common_sense_analysis",
        content: `Common sense analysis for mission. Flagged ${contradictions_flagged.length} contradictions and ${impossible_plans.length} impossible plans.`,
      });

      return {
        common_sense_rules,
        impossible_plans,
        contradictions_flagged,
        violated_assumptions,
      };
    } catch (e) {
      console.warn("Common Sense Engine Error:", e);
      return {
        common_sense_rules: [],
        impossible_plans: [],
        contradictions_flagged: [],
        violated_assumptions: [],
      };
    }
  }
}
