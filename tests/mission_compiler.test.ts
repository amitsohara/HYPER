import { describe, it, expect, vi, beforeEach } from "vitest";
import { MissionCompiler } from "../src/server/core/mission_compiler.js";

// Mock the engines module so we don't make real API calls
vi.mock("../src/server/engines.js", () => {
  return {
    generateWithRetry: vi.fn().mockImplementation(async (ai, config) => {
      // Return a mocked response based on prompt hints
      if (config.contents.includes("Executive Summary Generator")) {
        return {
          text: JSON.stringify({
            executive_summary: "Build a highly scalable robotics company targeting global markets.",
            confidence_score: 95,
            estimated_success_probability: 85,
            overall_risk_level: "High",
            research_findings: "Market is growing rapidly."
          })
        };
      } else if (config.contents.includes("Risk and Budget Extractor")) {
        return {
          text: JSON.stringify({
            budget_and_resources: "100 Crore initial investment.",
            risks_and_mitigations: "Supply chain risks; mitigate with local sourcing.",
            simulation_summary: "Simulated 10 world models with positive outcomes."
          })
        };
      } else if (config.contents.includes("Action Plan Generator")) {
        return {
          text: JSON.stringify({
            roadmap: "Q1 R&D, Q2 Prototypes, Q3 Manufacturing, Q4 Go-to-market.",
            weekly_action_plan: "Week 1: Hiring. Week 2: Factory setup.",
            investor_or_stakeholder_strategy: "Pitch to deep-tech VCs.",
            key_decisions: "Select affordable robotics components.",
            recommended_next_actions: ["Hire CTO", "Draft business plan"],
            next_recommended_mission: "Launch Series A round"
          })
        };
      } else if (config.contents.includes("classify it")) {
        return { text: JSON.stringify({ type: "business", stage: "planning" }) };
      } else if (config.contents.includes("candidate strategies")) {
        return { text: JSON.stringify([{ id: "opt_1", description: "Manufacturing AI Robotics", expected_outcome: "Good", estimated_resources: "100 Crore", estimated_timeline: "12 months", key_risks: ["Supply"], assumptions: ["Demand"] }]) };
      } else if (config.contents.includes("Analyze the tradeoffs")) {
        return { text: JSON.stringify({ "opt_1": { technical_complexity: 80 } }) };
      } else if (config.contents.includes("analyze their core assumptions")) {
        return { text: JSON.stringify({ "opt_1": [{ assumption: "Market ready", confidence: 90 }] }) };
      } else if (config.contents.includes("Rank the following candidate strategies")) {
        return { text: JSON.stringify([{ id: "opt_1", score: 91, reason: "Best alignment" }]) };
      } else if (config.contents.includes("Calculate the confidence level")) {
        return { text: JSON.stringify({ confidence_score: 84, confidence_reasoning: "Strong market demand", uncertainty: "Low" }) };
      }
      return { text: "{}" };
    }),
    cleanJSON: vi.fn().mockImplementation(async (text) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        return {};
      }
    })
  };
});

describe("MissionCompiler", () => {
  const dummyAi = {} as any; // We mocked generateWithRetry so we don't need a real AI instance
  const testMission = "Build a ₹100 crore robotics company";
  const rawMissionResult = {
    mission_id: "m-123",
    mission: testMission,
    beliefs: ["Robotics is the future"],
    goals: ["Make 100 crore"],
    plan: ["Step 1", "Step 2"],
    social_cognition: { emotions: [] },
    world_model: { scenarios: [] },
    digital_twin: { stats: [] },
    scientific_discovery: { ideas: [] },
    final_report: "This is a detailed report",
    executive_planning: { tasks: [] },
    // Some sensitive debug stuff
    _hidden_debug: "sensitive data",
    cognitive_state: { memory: "raw memory" }
  };

  it("should generate a complete report with all required sections", async () => {
    const report = await MissionCompiler.compile(dummyAi, rawMissionResult, { viewMode: "user" });

    expect(report.mission_id).toBe("m-123");
    expect(report.mission).toBe(testMission);
    expect(report.status).toBe("Mission Completed");
    
    // Extracted fields
    expect(report.confidence_score).toBe(84);
    expect(report.estimated_success_probability).toBe(85);
    expect(report.overall_risk_level).toBe("High");
    expect(report.executive_summary).toContain("Manufacturing AI Robotics");
    expect(report.roadmap).toContain("Q1 R&D");
    expect(report.budget_and_resources).toBe("100 Crore");
    expect(report.risks_and_mitigations).toBe("Supply");
    expect(report.weekly_action_plan).toBe("Week 1: Hiring. Week 2: Factory setup.");
    expect(report.investor_or_stakeholder_strategy).toBe("Pitch to deep-tech VCs.");
    expect(report.recommended_next_actions).toEqual(["Hire CTO", "Draft business plan"]);
    expect(report.next_recommended_mission).toBe("Launch Series A round");
  });

  it("should mask sensitive debug data in User Mode", async () => {
    const report = await MissionCompiler.compile(dummyAi, rawMissionResult, { viewMode: "user" });
    
    expect(report.developer_debug_data).toBeUndefined();
    expect(report.technical_appendix).toBeUndefined();
    expect((report as any)._hidden_debug).toBeUndefined();
    expect((report as any).cognitive_state).toBeUndefined();
  });

  it("should include debug data in Developer Mode", async () => {
    const report = await MissionCompiler.compile(dummyAi, rawMissionResult, { viewMode: "developer" });
    
    expect(report.technical_appendix).toBeDefined();
    expect(report.developer_debug_data).toBeDefined();
    expect(report.developer_debug_data._hidden_debug).toBe("sensitive data");
    expect(report.developer_debug_data.cognitive_state).toBeDefined();
  });
});
