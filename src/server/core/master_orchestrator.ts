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
import { TokenBudgetManager } from "./tokens/token_budget_manager.js";
import { tokenBudgetStorage } from "./tokens/token_context.js";
import { AdaptiveModuleRouter } from "./tokens/adaptive_module_router.js";
import { ContextCompressor } from "./tokens/context_compressor.js";
import { CostEstimator } from "./tokens/cost_estimator.js";
import { HyperMindCognitiveCore } from "./hcc/cognitive_core.js";

// We need a shared KG instance if we want, or we can use the one from server.ts.
// In server.ts, kgInstance is instantiated as `const kgInstance = new KnowledgeGraph();`
// We will instantiate one here if needed, or pass it in.

export class MasterOrchestrator {
  static currentStatus: any = { mission_id: null, stage: "idle" };
  static activeCore: HyperMindCognitiveCore | null = null;

  static async runMission(
    ai: GoogleGenAI,
    missionInput: any,
    kgInstance: KnowledgeGraph,
  ) {
    const { mission_text, simulation_mode = "realistic", mission_mode = "balanced" } = missionInput;
    const budgetManager = new TokenBudgetManager(mission_mode as any);

    return await tokenBudgetStorage.run(budgetManager, async () => {
      const core = new HyperMindCognitiveCore(mission_text);
      MasterOrchestrator.activeCore = core;
      
      const mission_id = core.getState().mission_id;
      const timestamp = new Date().toISOString();

      core.publishEvent("MISSION_STARTED", { simulation_mode, mission_mode }, "MasterOrchestrator");

      MasterOrchestrator.currentStatus = {
        mission_id,
        stage: "Starting pipeline...",
      };

      const routing = await AdaptiveModuleRouter.route(ai, mission_text, mission_mode as any);

      core.updateState({
          mission_type: "ANALYSIS", // could classify
          active_modules: routing.active,
          pending_modules: routing.active,
          version: core.getState().version + 1
      }, "MasterOrchestrator");

      const result: any = {
        mission_id,
        mission: mission_text,
        simulation_mode,
        mission_mode,
        timestamp,
        modules_used: routing.active,
        modules_skipped: routing.skipped
      };

      const safeExecute = async (moduleName: string, id: string, fn: () => Promise<any>) => {
        if (routing.skipped.includes(id)) {
            console.log(`[Orchestrator] Skipping ${moduleName} (Adaptive Routing)`);
            return null; // Skip module
        }

        MasterOrchestrator.currentStatus = {
          mission_id,
          stage: `Running: ${moduleName}`,
        };
        core.setAttention(moduleName);
        try {
          const res = await fn();
          core.updateState({
              completed_modules: [...core.getState().completed_modules, id],
              pending_modules: core.getState().pending_modules.filter(m => m !== id)
          }, "MasterOrchestrator");
          return res;
        } catch (e: any) {
          console.warn(`[Orchestrator] ${moduleName} failed:`, e);
          core.publishEvent("RISK_IDENTIFIED", { module: moduleName, error: e.message }, "MasterOrchestrator");
          return {
            module_name: moduleName,
            status: "failed",
            error: e.message || String(e),
            fallback_used: true,
          };
        }
      };

      // 1. Perception Layer (Context Reconstruction & Persistent Brain)
      const contextData = await safeExecute(
        "Perception Layer", "perception",
        async () => {
          const memoryContextStr = await PersistentBrain.reconstructContext(
            ai,
            mission_text,
          );
          const memoryContext = JSON.parse(memoryContextStr);
          const compressed = await ContextCompressor.compress(ai, memoryContextStr, 500);
          
          core.addWorkingMemory(`Reconstructed Context: ${compressed}`, 0.9);

          return {
            context_reconstruction: compressed,
            reused_memories:
              memoryContext.relevant_history?.map((h: any) => h.mission_text) ||
              [],
          };
        },
      ) || {};
      result.context_reconstruction =
        contextData.context_reconstruction || "No context.";
      result.reused_memories = contextData.reused_memories || [];

      // 2. Cognitive Intelligence Layer (Beliefs, Goals, Plans)
      const cognitiveData = await safeExecute(
        "Cognitive Intelligence Layer", "beliefs",
        async () => {
          // First update state
          await CognitiveArchitecture.updateStateFromMission(ai, {
            mission_id,
            mission_text,
          });
          await CognitiveArchitecture.reflectOnMission(ai, {
            mission_id,
            mission_text,
          });
          const state = await CognitiveArchitecture.getState();
          const gaps = state.knowledge_gaps || [];
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
          const finalState = await CognitiveArchitecture.getState();
          
          core.updateState({
              beliefs: finalState.beliefs,
          }, "CognitiveArchitecture");

          return {
            cognitive_state: finalState,
            beliefs: finalState.beliefs,
            goals: finalState.goals,
            plan: finalState.plans,
          };
        },
      ) || {};
      result.cognitive_state = cognitiveData.cognitive_state || {};
      result.beliefs = cognitiveData.beliefs || [];
      result.goals = cognitiveData.goals || [];
      result.plan = cognitiveData.plan || [];

      // 2.5 Social Cognitive Intelligence Layer
      const scilData = await safeExecute(
        "Social Cognitive Intelligence Layer", "social_cognition",
        async () => {
          const { SocialCognitiveEngine } = await import(
            "../social/social_cognitive_engine.js"
          ).catch((e) => import("../social/social_cognitive_engine.ts"));
          const scil = await SocialCognitiveEngine.analyzeSocialContext(ai, mission_text);
          core.updateState({ social_context: scil }, "SocialCognitiveEngine");
          return scil;
        }
      ) || {};
      result.social_cognition = scilData || {};

      // 4. Reasoning & Planning Layer (Executive Function / Task Manager)
      const execData = await safeExecute("Reasoning & Planning Layer", "executive", async () => {
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
      }) || {};
      result.tasks = execData.tasks || execData; // Depends on what it returns

      // 4. Synthetic World & Scenario Simulator
      const worldData = await safeExecute(
        "Synthetic World & World Model", "world_model",
        async () => {
          const worlds = await DynamicWorldGenerator.generate(
            ai,
            mission_text,
            simulation_mode,
            core.getContext(),
          );
          const wmUpdate = await WorldModelEngine.evolveFromEvidence(
            ai,
            mission_text,
          );
          
          core.updateState({ world_state: wmUpdate }, "WorldModel");
          core.publishEvent("SIMULATION_UPDATED", { worlds: worlds.length }, "WorldModel");

          return {
            synthetic_worlds: worlds,
            world_model: wmUpdate,
            scenario_results: [wmUpdate],
          };
        },
      ) || {};
      result.synthetic_worlds = worldData.synthetic_worlds || [];
      result.world_model = worldData.world_model || {};
      result.scenario_results = worldData.scenario_results || [];

      // 5. Multi-Agent Debate
      const debateData = await safeExecute("Multi-Agent Debate", "agent_debate", async () => {
        // Pick top worlds
        const topWorlds = (result.synthetic_worlds || []).slice(0, 10);

        // Generate some agent definitions manually since we don't have agentStore
        const agents = [
          { name: "strategist", prompt: "You are a master strategist." },
          { name: "scientist", prompt: "You are an empirical scientist." },
          { name: "ethicist", prompt: "You are a principled ethicist." },
        ];

        const compressedContext = await ContextCompressor.compress(ai, core.getContext(), 200);

        const scenarios = await AgentDebateEngine.run(
          ai,
          mission_text,
          topWorlds,
          simulation_mode,
          compressedContext,
          agents,
        );

        // Score them
        const scores = await CriticScoringEngine.scoreAll(
          ai,
          scenarios,
          simulation_mode,
          compressedContext,
        );
        scenarios.forEach((s: any, i: number) => {
          const scoreData = scores[i] || {};
          s.score = scoreData.final_score || 0;
          s.detailed_scores = scoreData;
        });
        scenarios.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));

        core.updateState({ decision_candidates: scenarios }, "AgentDebate");
        core.addEvidence({
            description: "Generated multiple agent perspectives and scenarios",
            source: "Agent Debate",
            confidence: 85,
            quality: "HIGH",
            module: "agent_debate"
        });

        return scenarios;
      }) || [];
      result.agent_debate = debateData;

      // 6. Multi-Agent Society (Phase 16)
      const societyData = await safeExecute("Multi-Agent Society", "multi_agent_society", async () => {
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
      }) || {};
      result.society_results = societyData || {};

      // 7. Scientific Discovery Platform (Phase 17)
      const discoveryData = await safeExecute(
        "Scientific Discovery", "scientific_discovery",
        async () => {
          const platformResult = await ScientificDiscoveryPlatform.discover(
            ai,
            mission_text,
            "Multidisciplinary Systems",
          );
          return platformResult;
        },
      ) || {};
      result.scientific_discovery = discoveryData || {};

      // 8. Supervised Recursive Improvement (Phase 18)
      const recursiveData = await safeExecute(
        "Recursive Improvement", "recursive_improvement",
        async () => {
          return await EvolutionEngine.evaluateAgents(
            ai,
            mission_text,
            result.agent_debate || [],
          );
        },
      ) || [];
      result.recursive_improvement = recursiveData || [];

      // 8. Autonomous Learning
      const learningData = await safeExecute("Autonomous Learning", "autonomous_learning", async () => {
        const learned = await AutonomousLearningEngine.extractSkill(ai, {
          mission_text,
        });
        core.publishEvent("LEARNING_ADDED", { skill: learned }, "AutonomousLearning");
        return {
          learning_events: [learned],
          extracted_skills: await AutonomousLearningEngine.getSkills(),
        };
      }) || {};
      result.learning_events = learningData.learning_events || [];
      result.extracted_skills = learningData.extracted_skills || [];

      // 8.5. Embodied Intelligence (Phase 19)
      const embodiedData = await safeExecute(
        "Embodied Intelligence", "embodied_intelligence",
        async () => {
          const { EmbodiedIntelligence } =
            await import("../embodied/embodied_intelligence.js").catch(
              (e) => import("../embodied/embodied_intelligence.ts"),
            );
          return await EmbodiedIntelligence.processMission(ai, mission_text);
        },
      ) || {};
      result.embodied_intelligence = embodiedData || {};

      // 8.6. Digital Twin Earth (Phase 20)
      const twinData = await safeExecute("Digital Twin Earth", "digital_twin", async () => {
        const { DigitalTwinEngine } =
          await import("../twin/digital_twin.js").catch(
            (e) => import("../twin/digital_twin.ts"),
          );
        return await DigitalTwinEngine.runSimulation(ai, mission_text);
      }) || {};
      result.digital_twin = twinData || {};

      // 8.7. Theory of Mind Engine (Phase 21)
      const tomData = await safeExecute("Theory of Mind Engine", "theory_of_mind", async () => {
        const { TheoryOfMindEngine } =
          await import("../tom/theory_of_mind.js").catch(
            (e) => import("../tom/theory_of_mind.ts"),
          );
        return await TheoryOfMindEngine.analyzeMission(ai, mission_text);
      }) || {};
      result.theory_of_mind = tomData || {};

      // 8.8. Common Sense Engine (Phase 24)
      const commonSenseData = await safeExecute(
        "Common Sense Engine", "common_sense",
        async () => {
          const { CommonSenseEngine } =
            await import("../commonsense/commonsense_engine.js").catch(
              (e) => import("../commonsense/commonsense_engine.ts"),
            );
          // Using the generated strategic plans or empty if not available
          const current_plan = result.executive_planning?.strategic_plans;
          return await CommonSenseEngine.analyze(ai, mission_text, current_plan);
        },
      ) || {};
      result.common_sense = commonSenseData || {};

      // 8.9. Collective Intelligence (Phase 25)
      const collectiveData = await safeExecute(
        "Collective Intelligence", "collective_intelligence",
        async () => {
          const { SocietyManager } =
            await import("../collective/society_manager.js").catch(
              (e) => import("../collective/society_manager.ts"),
            );
          return await SocietyManager.runCollective(ai, mission_text);
        },
      ) || {};
      result.collective_intelligence = collectiveData || {};

      // 9. Knowledge Graph Update
      const kgData = await safeExecute("Knowledge Graph Update", "knowledge_graph", async () => {
        await kgInstance.update(ai, result);
        return {
          knowledge_graph_updates: true,
        };
      }) || {};
      result.knowledge_graph_updates = kgData.knowledge_graph_updates || {};

      // 5. Mission Compiler (Final Report Generator)
      const finalReportData = await safeExecute(
        "Mission Compiler", "mission_compiler",
        async () => {
          core.updateState({ mission_stage: "SYNTHESIZING" }, "MissionCompiler");
          const prompt = `Synthesize a final report for this mission based ONLY on this Cognitive Core Context:
${core.getContext()}

Return JSON:
{
  "final_report": "Comprehensive summary including Technical Recommendation, Human Impact, Leadership Advice, Communication Advice, Conflict Risks, and Next Best Action.",
  "next_actions": ["Action 1", "Action 2"]
}`;
          const reportRes = await generateWithRetry(ai, {
            model: "gemini-1.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
          });
          const reportData = await cleanJSON(reportRes?.text || "{}", ai);
          core.updateState({ current_recommendation: reportData }, "MissionCompiler");
          return reportData;
        },
      ) || {};
      result.final_report =
        finalReportData.final_report || "Final report generated.";
      result.next_actions = finalReportData.next_actions || [];

      // Save to Persistent Brain
      await safeExecute("Memory Consolidation", "memory", async () => {
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
      await safeExecute("Automated Benchmark Evaluation", "benchmark_results", async () => {
        const { BenchmarkEngine } =
          await import("../benchmark/benchmark_engine.js").catch(
            (e) => import("../benchmark/benchmark_engine.ts"),
          );
        await BenchmarkEngine.evaluateMission(ai, mission_text, result);
      });

      MasterOrchestrator.currentStatus = { mission_id: null, stage: "idle" };
      core.updateState({ mission_stage: "COMPLETED" }, "MasterOrchestrator");

      // Append token usage data
      const tokenStats = budgetManager.getUsage();
      result.tokens_used = tokenStats.usedTokens;
      result.token_savings = tokenStats.savedTokens;
      result.estimated_cost = CostEstimator.formatCost(CostEstimator.estimateCost(tokenStats.usedTokens * 0.8, tokenStats.usedTokens * 0.2));

      return result;
    });
  }
}


