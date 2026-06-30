import { SpecialistType } from "./cognitiveTypes.js";

export class CognitiveScheduler {
    
    // Defines the standard execution sequence for a full cognitive cycle
    public getStandardSequence(): SpecialistType[] {
        return [
            SpecialistType.OBSERVATION,
            SpecialistType.ATTENTION,
            SpecialistType.WORKING_MEMORY,
            SpecialistType.KNOWLEDGE,
            SpecialistType.WORLD_MODEL,
            SpecialistType.GOAL_MANAGER,
            SpecialistType.CURIOSITY,
            SpecialistType.HYPOTHESIS,
            SpecialistType.REASONING,
            SpecialistType.PLANNING,
            SpecialistType.SIMULATION,
            SpecialistType.VERIFICATION,
            SpecialistType.DECISION,
            SpecialistType.REFLECTION,
            SpecialistType.LEARNING,
            SpecialistType.COMMUNICATION
        ];
    }
}
