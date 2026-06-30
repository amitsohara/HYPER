import { CognitiveRuntime } from "./cognitiveRuntime.js";
import { ThinkingSession } from "./thinkingSession.js";
import { CognitiveTask } from "./cognitiveTypes.js";
import { CognitiveEventBus, CognitiveEvents } from "./cognitiveEvents.js";
import { CognitiveMetrics } from "./cognitiveMetrics.js";
import { v4 as uuidv4 } from "uuid";

export class ExecutiveCognitiveCore {
    private eventBus = CognitiveEventBus.getInstance();
    public runtime = new CognitiveRuntime();
    private activeSessions: Map<string, ThinkingSession> = new Map();

    public async processTask(inputData: any, description: string): Promise<any> {
        const task: CognitiveTask = {
            task_id: uuidv4(),
            description,
            input_data: inputData,
            priority: 1,
            timestamp: Date.now()
        };

        const session = new ThinkingSession(task);
        this.activeSessions.set(session.session_id, session);
        
        CognitiveMetrics.recordSession();
        this.eventBus.publish(CognitiveEvents.COGNITIVE_CYCLE_STARTED, { session_id: session.session_id, task });

        try {
            session.status = 'THINKING';
            // Execute the full internal thinking sequence
            await this.runtime.cycle.executeFullCycle(session.context);

            // After cycle, extract final decision and output
            const decision = session.context.blackboard.read("DECISION");
            const communication = session.context.blackboard.read("COMMUNICATION");
            
            // Generate pseudo confidence for the metrics
            const confidence = 0.9;
            CognitiveMetrics.recordDecision(confidence);

            session.complete();
            this.eventBus.publish(CognitiveEvents.COGNITIVE_CYCLE_FINISHED, { session_id: session.session_id, success: true });

            return {
                session_id: session.session_id,
                decision,
                communication,
                confidence
            };

        } catch (e) {
            session.fail();
            this.eventBus.publish(CognitiveEvents.COGNITIVE_CYCLE_FINISHED, { session_id: session.session_id, success: false, error: e });
            throw e;
        } finally {
            this.activeSessions.delete(session.session_id);
        }
    }
}
