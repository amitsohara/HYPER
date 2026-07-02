import { IntelligenceRequest, ArbitrationDecision, ProviderType } from "../types/index.js";

export class KnowledgeGapAnalyzer {
    analyze(request: IntelligenceRequest): number {
        // Evaluate if the system has sufficient internal knowledge
        // Higher score (0.0 to 1.0) means higher gap.
        if (request.domain === "CREATIVE" || request.domain === "RESEARCH") return 0.8;
        if (request.domain === "SENSORIMOTOR") return 0.05;
        return 0.3;
    }
}

export class NoveltyDetector {
    detect(context: any): number {
        // Detect novelty in the scenario. 0 to 1.
        return context.noveltyScore || 0.2;
    }
}

export class ConfidenceEvaluator {
    evaluate(internalConfidence: number): number {
        return internalConfidence;
    }
}

export class MissionCriticalityEvaluator {
    evaluate(request: IntelligenceRequest): number {
        return request.priority > 5 ? 0.9 : 0.4;
    }
}
