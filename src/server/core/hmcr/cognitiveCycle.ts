import { ThinkingContext } from "./thinkingContext.js";
import { CognitiveScheduler } from "./cognitiveScheduler.js";
import { SpecialistManager } from "./specialistManager.js";
import { CognitiveStateManager } from "./cognitiveStateManager.js";
import { CognitivePolicies } from "./cognitivePolicies.js";

export class CognitiveCycle {
    constructor(
        private scheduler: CognitiveScheduler,
        private specialistManager: SpecialistManager,
        private stateManager: CognitiveStateManager
    ) {}

    public async executeFullCycle(context: ThinkingContext): Promise<void> {
        context.activeCycle++;
        const sequence = this.scheduler.getStandardSequence();

        for (const specialistType of sequence) {
            // Update state
            this.stateManager.setActiveSpecialists(context.state, [specialistType]);

            // Execute
            try {
                const result = await this.specialistManager.executeSpecialist(specialistType, context.task.input_data, context.blackboard);
                
                // Write result to blackboard
                context.blackboard.write(specialistType, result, specialistType);

            } catch (e) {
                console.warn(`[HMCR] Specialist ${specialistType} execution skipped or failed:`, e);
                // In a robust system we might handle failures specifically or fallback
            }
        }
    }
}
