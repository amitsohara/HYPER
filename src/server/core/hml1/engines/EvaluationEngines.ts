import { MissionTrace } from "../types.js";

export class CognitiveEvaluator {
    evaluate(trace: MissionTrace): number {
        // Base evaluation logic, expecting subclasses to override
        return 0.9;
    }
}

export class PerceptionEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.95; }
}

export class WorldModelEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.93; }
}

export class ConceptEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.90; }
}

export class ReasoningEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.92; }
}

export class PlanningEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.91; }
}

export class SimulationEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.94; }
}

export class DecisionEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.93; }
}

export class ActionEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.89; }
}

export class LearningEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.90; }
}

export class SensorimotorEvaluator extends CognitiveEvaluator {
    evaluate(trace: MissionTrace): number { return 0.88; }
}
