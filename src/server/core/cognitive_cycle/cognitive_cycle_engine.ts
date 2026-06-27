import { GoogleGenAI } from "@google/genai";
import { CycleState } from "./cycle_state.js";
import { CycleTrace, CycleTraceEntry } from "./cycle_trace.js";
import { CyclePolicy } from "./cycle_policy.js";
import { CycleScheduler } from "./cycle_scheduler.js";
import { ICycleStep } from "./cycle_step.js";
import { ObserveStep } from "./observe_step.js";
import { UnderstandStep } from "./understand_step.js";
import { ImagineStep } from "./imagine_step.js";
import { ReasonStep } from "./reason_step.js";
import { PredictStep } from "./predict_step.js";
import { DecideStep } from "./decide_step.js";
import { ActStep } from "./act_step.js";
import { ObserveOutcomeStep } from "./outcome_observer.js";
import { ExperienceStep } from "./experience_step.js";
import { ReflectStep } from "./reflect_step.js";
import { LearnStep } from "./learn_step.js";
import { BeliefUpdateStep } from "./belief_update_step.js";
import { ImproveStep } from "./improve_step.js";
import { HyperMindCognitiveCore } from "../hcc/cognitive_core.js";
import { hccStorage } from "../hcc/hcc_storage.js";

export class CognitiveCycleEngine {
  private static stepInstances: Record<string, ICycleStep> = {
    Observe: new ObserveStep(),
    Understand: new UnderstandStep(),
    Imagine: new ImagineStep(),
    Reason: new ReasonStep(),
    Predict: new PredictStep(),
    Decide: new DecideStep(),
    Act: new ActStep(),
    ObserveOutcome: new ObserveOutcomeStep(),
    Experience: new ExperienceStep(),
    Reflect: new ReflectStep(),
    Learn: new LearnStep(),
    UpdateBeliefs: new BeliefUpdateStep(),
    Improve: new ImproveStep(),
  };

  static async runMissionCycle(
    ai: GoogleGenAI | null,
    missionId: string,
    missionText: string,
    mode: string,
    userContext?: any
  ): Promise<CycleState> {
    console.log(`[CognitiveCycleEngine] Starting cycle for mission: ${missionId} (Mode: ${mode})`);

    const core = new HyperMindCognitiveCore(missionId);
    
    let state: CycleState = {
      cycle_id: `cycle_${Date.now()}`,
      mission_id: missionId,
      mission: missionText,
      user_context: userContext || {},
      mode: mode,
      status: "running",
      current_step: "Initializing",
      started_at: Date.now(),
      modules_used: [],
      modules_skipped: [],
      modules_failed: [],
      token_usage: 0,
      estimated_cost: 0,
      errors: [],
      warnings: [],
      trace: []
    };

    const traceManager = new CycleTrace();
    core.updateState({ current_cycle: state.cycle_id }, "CognitiveCycleEngine");

    let iterationCount = 1;
    
    while (CyclePolicy.shouldContinue(state, iterationCount)) {
      console.log(`[CognitiveCycleEngine] Iteration ${iterationCount} starting...`);
      
      const stepsToRun = CycleScheduler.getExecutionSteps(state.mode);
      
      for (const stepName of stepsToRun) {
        state.current_step = stepName;
        core.updateState({ current_step: stepName }, "CognitiveCycleEngine");
        
        const step = this.stepInstances[stepName];
        if (!step) {
          console.warn(`[CognitiveCycleEngine] Step ${stepName} not found!`);
          state.modules_skipped.push(stepName);
          continue;
        }

        const traceEntry: CycleTraceEntry = {
          step_name: stepName,
          status: "started",
          timestamp: Date.now()
        };
        
        try {
          console.log(`[CognitiveCycleEngine] Executing step: ${stepName}`);
          await step.execute(ai, state, core);
          state.modules_used.push(stepName);
          traceEntry.status = "completed";
        } catch (e: any) {
          console.error(`[CognitiveCycleEngine] Error in step ${stepName}:`, e);
          traceEntry.status = "failed";
          traceEntry.error = e.message;
          state.modules_failed.push(stepName);
          state.errors.push({ step: stepName, message: e.message, timestamp: Date.now() });
        } finally {
          traceManager.addEntry(traceEntry);
          state.trace = traceManager.getTrace();
          // Periodically save state to HCC
          await hccStorage.saveCognitiveState(missionId, "cycle_state", state);
        }
      }
      
      iterationCount++;
    }

    state.status = state.errors.length > 0 ? "failed" : "completed";
    state.completed_at = Date.now();
    
    try {
        const { ExperienceEngine } = await import("../hecs/experience_engine.js");
        const { ExperienceGraph } = await import("../hecs/experience_graph.js");
        const { ExperienceMetricsTracker } = await import("../hecs/experience_metrics.js");
        
        // ensure we pass ai properly, ai might be null if dev_stub is used, but ExperienceEngine handles it via generateWithRetry which handles null ai in stub mode
        if (ai || process.env.MODEL_MODE === 'dev_stub') {
           const finalHccState = core.getState();
           const exp = await ExperienceEngine.generateExperience(ai as any, {
                mission: state.mission,
                mission_type: finalHccState.mission_type,
                understanding: finalHccState.mission_understanding,
                completed_modules: state.modules_used,
                report: (state as any).report || state.action?.plan || state.decision,
                learning_summary: (state as any).learning_summary,
                evidence: finalHccState.evidence || [],
                workspace_id: finalHccState.current_workspace_id
           });
           
           if (exp) {
               core.updateState({
                   experience_summary: exp,
                   experience_graph: ExperienceGraph.getGraph(),
                   experience_count: ExperienceMetricsTracker.getMetrics().total_experiences,
                   recent_experience_ids: [exp.experience_id]
               } as any, "HECS");
           }
        }

        // HKES Part: Run Knowledge Evolution
        try {
            const { KnowledgeEvolutionEngine } = await import("../hkes/knowledge_evolution_engine.js");
            const newAbstractions = await KnowledgeEvolutionEngine.evolve(ai);
            
            if (newAbstractions.length > 0) {
                const { AbstractionMetrics } = await import("../hkes/abstraction_metrics.js");
                const { AbstractionType } = await import("../hkes/abstraction_types.js");
                const patterns = newAbstractions.filter(a => a.abstraction_type === AbstractionType.PATTERN);
                const heuristics = newAbstractions.filter(a => a.abstraction_type === AbstractionType.HEURISTIC);
                const causalModels = newAbstractions.filter(a => a.abstraction_type === AbstractionType.CAUSAL_MODEL);
                
                core.updateState({
                    recent_abstractions: newAbstractions,
                    abstraction_count: AbstractionMetrics.metrics.total_abstractions,
                    hkes_patterns_created: patterns.length > 0,
                    recent_patterns: patterns,
                    pattern_count: AbstractionMetrics.metrics.by_type[AbstractionType.PATTERN] || 0,
                    new_heuristics_created: heuristics.length > 0,
                    recent_heuristics: heuristics,
                    heuristic_summary: `Created ${heuristics.length} new heuristics.`,
                    new_causal_models_created: causalModels.length > 0,
                    recent_causal_models: causalModels,
                    causal_graph_summary: `Created ${causalModels.length} new causal models.`
                } as any, "HKES");
            }
        } catch (e) {
            console.error("[CognitiveCycleEngine] HKES generation failed", e);
        }
    } catch (e: any) {
        console.error("[CognitiveCycleEngine] HECS generation failed", e);
    }
    
    state.hcc_state_after = core.getState();
    state.current_step = "Done";

    core.updateState({ current_step: "Done" }, "CognitiveCycleEngine");
    await hccStorage.saveCognitiveState(missionId, "cycle_state", state);
    
    console.log(`[CognitiveCycleEngine] Cycle finished with status: ${state.status}`);
    return state;
  }
}
