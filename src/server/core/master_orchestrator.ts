import { GoogleGenAI } from "@google/genai";
import { PersistentBrain } from "../brain/persistent_brain.js";
import { CognitiveArchitecture } from "../cognitive/cognitive_architecture.js";
import { ExecutiveFunction } from "../executive/executive_function.js";
import { WorldModelEngine } from "../world/world_model.js";
import {
  DynamicWorldGenerator,
  AgentDebateEngine,
  CriticScoringEngine,
} from "../engines.js";
import { ScientificDiscoveryPlatform } from "../discovery/scientific_discovery.js";
import { EvolutionEngine } from "../evolution.js";
import { AutonomousLearningEngine } from "../learning/autonomous_learning.js";
import { KnowledgeGraph } from "../knowledge_graph.js";
import { generateWithRetry, cleanJSON } from "../engines.js";

// We need a shared KG instance if we want, or we can use the one from server.ts.
// In server.ts, kgInstance is instantiated as `const kgInstance = new KnowledgeGraph();`
// We will instantiate one here if needed, or pass it in.

export class MasterOrchestrator {
  static currentStatus: any = { mission_id: null, stage: "idle" };

  static async runMission(
    ai: GoogleGenAI,
    missionInput: any,
    kgInstance: KnowledgeGraph,
  ) {
    const { mission_text, simulation_mode = "realistic" } = missionInput;
    const mission_id = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();

    MasterOrchestrator.currentStatus = {
      mission_id,
      stage: "Starting pipeline...",
    };

    const result: any = {
      mission_id,
      mission: mission_text,
      simulation_mode,
      timestamp,
    };

    const safeExecute = async (moduleName: string, fn: () => Promise<any>) => {
      MasterOrchestrator.currentStatus = {
        mission_id,
        stage: `Running: ${moduleName}`,
      };
      try {
        return await fn();
      } catch (e: any) {
        console.error(`[Orchestrator] ${moduleName} failed:`, e);
        return {
          module_name: moduleName,
          status: "failed",
          error: e.message || String(e),
          fallback_used: true,
        };
      }
    };

    // 1. Context Reconstruction & Persistent Brain
    const contextData = await safeExecute(
      "Context Reconstruction & Persistent Brain",
      async () => {
        const memoryContextStr = await PersistentBrain.reconstructContext(
          ai,
          mission_text,
        );
        const memoryContext = JSON.parse(memoryContextStr);
        return {
          context_reconstruction: memoryContextStr,
          reused_memories:
            memoryContext.relevant_history?.map((h: any) => h.mission_text) ||
            [],
        };
      },
    );
    result.context_reconstruction =
      contextData.context_reconstruction || "No context.";
    result.reused_memories = contextData.reused_memories || [];

    // 2. Cognitive Architecture (Beliefs, Goals, Plans)
    const cognitiveData = await safeExecute(
      "Cognitive Architecture",
      async () => {
        // First update state
        await CognitiveArchitecture.updateStateFromMission(ai, {
          mission_id,
          mission_text,
        });
        const gaps = await CognitiveArchitecture.reflectOnMission(ai, {
          mission_id,
          mission_text,
        });
        let goals: any = null;
        if (gaps && gaps.length > 0) {
          goals = await CognitiveArchitecture.generateGoalsFromGaps(ai, gaps);
        } else {
          goals = await CognitiveArchitecture.generateGoalsFromGaps(ai, [
            "Determine next optimal steps for mission",
          ]);
        }
        if (goals) {
          await CognitiveArchitecture.planMultiStepTask(ai, goals);
        }
        const state = CognitiveArchitecture.getState();
        return {
          cognitive_state: state,
          beliefs: state.beliefs,
          goals: state.goals,
          plan: state.plans,
        };
      },
    );
    result.cognitive_state = cognitiveData.cognitive_state || {};
    result.beliefs = cognitiveData.beliefs || [];
    result.goals = cognitiveData.goals || [];
    result.plan = cognitiveData.plan || [];

    // 3. Executive Function / Task Manager
    const execData = await safeExecute("Executive Function", async () => {
      const tasks = [];
      for (const step of result.plan) {
        const task = await ExecutiveFunction.submitTask({
          name: `Mission Step: ${step}`,
          description: `Executing step from mission ${mission_id}`,
          priority: 50,
          estimated_difficulty: 5,
          expected_value: 50,
        });
        tasks.push(task);
      }
      return { tasks };
    });
    result.tasks = execData.tasks || execData; // Depends on what it returns

    // 4. Synthetic World & Scenario Simulator
    const worldData = await safeExecute(
      "Synthetic World & World Model",
      async () => {
        const worlds = await DynamicWorldGenerator.generate(
          ai,
          mission_text,
          simulation_mode,
          result.context_reconstruction || "",
        );
        const wmUpdate = await WorldModelEngine.evolveFromEvidence(
          ai,
          mission_text,
        );
        return {
          synthetic_worlds: worlds,
          world_model: wmUpdate,
          scenario_results: [wmUpdate],
        };
      },
    );
    result.synthetic_worlds = worldData.synthetic_worlds || [];
    result.world_model = worldData.world_model || {};
    result.scenario_results = worldData.scenario_results || [];

    // 5. Multi-Agent Debate
    const debateData = await safeExecute("Multi-Agent Debate", async () => {
      // Pick top worlds
      const topWorlds = (result.synthetic_worlds || []).slice(0, 10);

      // Generate some agent definitions manually since we don't have agentStore
      const agents = [
        { name: "strategist", prompt: "You are a master strategist." },
        { name: "scientist", prompt: "You are an empirical scientist." },
        { name: "ethicist", prompt: "You are a principled ethicist." },
      ];

      const scenarios = await AgentDebateEngine.run(
        ai,
        mission_text,
        topWorlds,
        simulation_mode,
        result.context_reconstruction || "",
        agents,
      );

      // Score them
      const scores = await CriticScoringEngine.scoreAll(
        ai,
        scenarios,
        simulation_mode,
        result.context_reconstruction || "",
      );
      scenarios.forEach((s: any, i: number) => {
        const scoreData = scores[i] || {};
        s.score = scoreData.final_score || 0;
        s.detailed_scores = scoreData;
      });
      scenarios.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

      return scenarios;
    });
    result.agent_debate = debateData;

    // 6. Multi-Agent Society (Phase 16)
    const societyData = await safeExecute("Multi-Agent Society", async () => {
      const { MultiAgentSociety } =
        await import("../society/multi_agent_society.js").catch(
          (e) => import("../society/multi_agent_society.ts"),
        );
      const coalition = await MultiAgentSociety.formCoalition(
        ai,
        mission_text,
        ["researcher", "analyst", "planner"],
      );
      const vote = await MultiAgentSociety.holdVote(
        `Proceed with mission: ${mission_text}`,
      );
      const negotiation = await MultiAgentSociety.simulateNegotiation(
        ai,
        `Resource allocation for: ${mission_text}`,
      );
      return {
        coalition,
        vote,
        negotiation,
      };
    });
    result.society_results = societyData || {};

    // 7. Scientific Discovery Platform (Phase 17)
    const discoveryData = await safeExecute(
      "Scientific Discovery",
      async () => {
        const platformResult = await ScientificDiscoveryPlatform.discover(
          ai,
          mission_text,
          "Multidisciplinary Systems",
        );
        return platformResult;
      },
    );
    result.scientific_discovery = discoveryData || {};

    // 8. Supervised Recursive Improvement (Phase 18)
    const recursiveData = await safeExecute(
      "Recursive Improvement",
      async () => {
        return await EvolutionEngine.evaluateAgents(
          ai,
          mission_text,
          result.agent_debate || [],
        );
      },
    );
    result.recursive_improvement = recursiveData || [];

    // 8. Autonomous Learning
    const learningData = await safeExecute("Autonomous Learning", async () => {
      const learned = await AutonomousLearningEngine.extractSkill(ai, {
        mission_text,
      });
      return {
        learning_events: [learned],
        extracted_skills: await AutonomousLearningEngine.getSkills(),
      };
    });
    result.learning_events = learningData.learning_events || [];
    result.extracted_skills = learningData.extracted_skills || [];

    // 8.5. Embodied Intelligence (Phase 19)
    const embodiedData = await safeExecute(
      "Embodied Intelligence",
      async () => {
        const { EmbodiedIntelligence } =
          await import("../embodied/embodied_intelligence.js").catch(
            (e) => import("../embodied/embodied_intelligence.ts"),
          );
        return await EmbodiedIntelligence.processMission(ai, mission_text);
      },
    );
    result.embodied_intelligence = embodiedData || {};

    // 8.6. Digital Twin Earth (Phase 20)
    const twinData = await safeExecute("Digital Twin Earth", async () => {
      const { DigitalTwinEngine } =
        await import("../twin/digital_twin.js").catch(
          (e) => import("../twin/digital_twin.ts"),
        );
      return await DigitalTwinEngine.runSimulation(ai, mission_text);
    });
    result.digital_twin = twinData || {};

    // 8.7. Theory of Mind Engine (Phase 21)
    const tomData = await safeExecute("Theory of Mind Engine", async () => {
      const { TheoryOfMindEngine } =
        await import("../tom/theory_of_mind.js").catch(
          (e) => import("../tom/theory_of_mind.ts"),
        );
      return await TheoryOfMindEngine.analyzeMission(ai, mission_text);
    });
    result.theory_of_mind = tomData || {};

    // 8.8. Common Sense Engine (Phase 24)
    const commonSenseData = await safeExecute(
      "Common Sense Engine",
      async () => {
        const { CommonSenseEngine } =
          await import("../commonsense/commonsense_engine.js").catch(
            (e) => import("../commonsense/commonsense_engine.ts"),
          );
        // Using the generated strategic plans or empty if not available
        const current_plan = result.executive_planning?.strategic_plans;
        return await CommonSenseEngine.analyze(ai, mission_text, current_plan);
      },
    );
    result.common_sense = commonSenseData || {};

    // 8.9. Collective Intelligence (Phase 25)
    const collectiveData = await safeExecute(
      "Collective Intelligence",
      async () => {
        const { SocietyManager } =
          await import("../collective/society_manager.js").catch(
            (e) => import("../collective/society_manager.ts"),
          );
        return await SocietyManager.runCollective(ai, mission_text);
      },
    );
    result.collective_intelligence = collectiveData || {};

    // 9. Knowledge Graph Update
    const kgData = await safeExecute("Knowledge Graph Update", async () => {
      await kgInstance.update(ai, result);
      return {
        knowledge_graph_updates: true,
      };
    });
    result.knowledge_graph_updates = kgData.knowledge_graph_updates || {};

    // 10. Final Report Generator
    const finalReportData = await safeExecute(
      "Final Report Generator",
      async () => {
        const prompt = `Synthesize a final report for this mission: "${mission_text}".
Return JSON:
{
  "final_report": "Comprehensive summary...",
  "next_actions": ["Action 1", "Action 2"]
}`;
        const reportRes = await generateWithRetry(ai, {
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });
        return await cleanJSON(reportRes?.text || "{}", ai);
      },
    );
    result.final_report =
      finalReportData.final_report || "Final report generated.";
    result.next_actions = finalReportData.next_actions || [];

    // Save to Persistent Brain
    await safeExecute("Memory Consolidation", async () => {
      await PersistentBrain.storeEpisodicMemory({
        mission_text,
        simulation_mode,
        debate_count: result.agent_debate?.length || 0,
        report_summary: result.final_report,
      });
      await PersistentBrain.storeSemanticMemory(
        "Mission Analysis",
        "Synthesized from: " + mission_text,
      );
      await PersistentBrain.updateConceptNode("AGI Pipeline", [
        "Mission Execution",
        "Analysis",
      ]);
    });

    // Automated Benchmark Evaluation
    await safeExecute("Automated Benchmark Evaluation", async () => {
      const { BenchmarkEngine } =
        await import("../benchmark/benchmark_engine.js").catch(
          (e) => import("../benchmark/benchmark_engine.ts"),
        );
      // Generate a random mock version, but in a real system we'd track model iteration.
      const autoVersion =
        "HyperMind-X v" +
        (Math.floor(Math.random() * 10) + 1) +
        "." +
        Math.floor(Math.random() * 9) +
        " (Auto-Eval)";
      await BenchmarkEngine.runSuite(ai, autoVersion);
    });

    MasterOrchestrator.currentStatus = { mission_id: null, stage: "idle" };

    return result;
  }
}
