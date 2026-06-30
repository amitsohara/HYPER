import { CognitiveState, CognitiveMode, SpecialistType } from "./cognitiveTypes.js";

export class CognitiveStateManager {
    
    public updateMode(state: CognitiveState, newMode: CognitiveMode) {
        state.mode = newMode;
    }

    public setActiveSpecialists(state: CognitiveState, specialists: SpecialistType[]) {
        state.active_specialists = specialists;
    }

    public updateConfidence(state: CognitiveState, confidence: number) {
        state.confidence_level = confidence;
    }
}
