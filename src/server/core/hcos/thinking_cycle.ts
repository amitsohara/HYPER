import { ThinkingSession } from "./thinking_session.js";
import { SessionStatus, ThoughtStatus, ModuleType } from "./thinking_types.js";
import { StopController } from "./stop_controller.js";
import { ThinkingPolicy } from "./thinking_policy.js";
import { ThinkingScheduler } from "./thinking_scheduler.js";
import { ThoughtBranch } from "./thought_branch.js";
import { ThoughtMerger } from "./thought_merger.js";
import { ThinkingLogger } from "./thinking_logger.js";

export class ThinkingCycle {
    static async tick(session: ThinkingSession) {
        if (session.status !== SessionStatus.RUNNING) return;
        
        // 1. Check Stop Conditions
        const stopCheck = StopController.shouldStop(session.budget, session.confidence, session.analysis.complexity);
        if (stopCheck.stop) {
            session.status = SessionStatus.COMPLETED;
            session.events.emit("MISSION_COMPLETED", { reason: stopCheck.reason });
            ThinkingLogger.log(session.session_id, `Mission completed. Reason: ${stopCheck.reason}`);
            return;
        }
        
        session.budget.consumeIteration();
        
        // 2. Select Highest Priority Thought
        let thought = session.stack.getHighestPriorityPending();
        if (!thought) {
            // No pending thoughts, we might be done or stuck
            session.status = SessionStatus.COMPLETED;
            ThinkingLogger.log(session.session_id, "No more productive branches. Stopping.");
            return;
        }
        
        session.stack.setActive(thought.thought_id);
        ThinkingLogger.log(session.session_id, `Active thought: ${thought.description}`);
        
        // 3. Choose Next Module
        const targetModule = thought.target_module || ThinkingPolicy.determineModule({}, session.attention);
        
        // 4. Execute Module (via HCW in reality, mocked here via Scheduler)
        session.events.emit("MODULE_STARTED", { module: targetModule });
        const result = ThinkingScheduler.executeModule(targetModule, thought);
        session.module_history.push({ module: targetModule, time: Date.now(), result });
        session.events.emit("MODULE_FINISHED", { module: targetModule, result });
        
        // 5. Update Workspace & State (Mock)
        thought.results = result;
        thought.status = ThoughtStatus.COMPLETED;
        
        // Branching Logic (if module generates alternatives)
        if (result.alternatives && result.alternatives.length > 0) {
             ThinkingLogger.log(session.session_id, `Branching into ${result.alternatives.length} alternatives.`);
             const branches = ThoughtBranch.fork(thought, result.alternatives);
             for (const b of branches) {
                  b.target_module = ModuleType.SIMULATION; // Next step for alt is usually to simulate
                  session.stack.addThought(b);
                  session.events.emit("BRANCH_CREATED", { branch: b });
             }
        }
        
        // Merging Logic (if module selected a winner)
        if (result.winner) {
             const activeAlts = session.stack.getAll().filter(t => t.parent_id === thought.parent_id && t.status !== ThoughtStatus.MERGED);
             const winnerId = activeAlts.find(a => a.description === result.winner)?.thought_id;
             if (winnerId) {
                 ThoughtMerger.merge(activeAlts, winnerId);
                 session.events.emit("THOUGHT_MERGED", { winner: winnerId });
                 ThinkingLogger.log(session.session_id, `Merged branch. Winner: ${result.winner}`);
             }
        }
        
        // 6. Evaluate Progress & Confidence
        // Mock confidence update based on module execution
        if (targetModule === ModuleType.SIMULATION || targetModule === ModuleType.PLANNER) {
            session.confidence = Math.min(100, session.confidence + (100 / session.analysis.estimated_reasoning_depth));
            session.events.emit("CONFIDENCE_UPDATED", { confidence: session.confidence });
        }
        
        // 7. Checkpoints
        if (session.budget.current_iterations % 5 === 0) {
            session.saveCheckpoint();
        }
    }
}
