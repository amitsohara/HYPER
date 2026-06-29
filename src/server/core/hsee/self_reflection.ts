import { ThinkingEvaluator } from "./thinking_evaluator.js";

export class SelfReflection {
    static reflect(missionData: any): any {
        return ThinkingEvaluator.evaluate(missionData);
    }
}
