import { MissionScore, HyperMindIntelligenceIndex, MissionTrace, MissionScenarioDefinition } from "../types.js";
import { 
    PerceptionEvaluator, WorldModelEvaluator, ConceptEvaluator,
    ReasoningEvaluator, PlanningEvaluator, SimulationEvaluator,
    DecisionEvaluator, ActionEvaluator, LearningEvaluator, SensorimotorEvaluator
} from "./EvaluationEngines.js";

export class MissionScoreEngine {
    private evaluators = {
        perception: new PerceptionEvaluator(),
        worldModel: new WorldModelEvaluator(),
        concept: new ConceptEvaluator(),
        reasoning: new ReasoningEvaluator(),
        planning: new PlanningEvaluator(),
        simulation: new SimulationEvaluator(),
        decision: new DecisionEvaluator(),
        action: new ActionEvaluator(),
        learning: new LearningEvaluator(),
        sensorimotor: new SensorimotorEvaluator()
    };

    scoreMission(scenario: MissionScenarioDefinition, trace: MissionTrace, success: boolean): MissionScore {
        const subsystemScores = {
            perception: this.evaluators.perception.evaluate(trace),
            worldModel: this.evaluators.worldModel.evaluate(trace),
            conceptFormation: this.evaluators.concept.evaluate(trace),
            reasoning: this.evaluators.reasoning.evaluate(trace),
            planning: this.evaluators.planning.evaluate(trace),
            simulation: this.evaluators.simulation.evaluate(trace),
            decisionMaking: this.evaluators.decision.evaluate(trace),
            actionExecution: this.evaluators.action.evaluate(trace),
            lifelongLearning: this.evaluators.learning.evaluate(trace),
            sensorimotorSkills: this.evaluators.sensorimotor.evaluate(trace)
        };

        const overall = Object.values(subsystemScores).reduce((a, b) => a + b, 0) / 10;

        return {
            missionId: trace.missionId,
            scenarioId: scenario.id,
            timestamp: Date.now(),
            overallScore: overall,
            success,
            durationMs: trace.endTime - trace.startTime,
            subsystemScores
        };
    }
}

export class CertificationEngine {
    generateHII(scores: MissionScore[], version: string): HyperMindIntelligenceIndex {
        // Aggregate scores across all missions in the Grand Challenge
        const numMissions = scores.length;
        if (numMissions === 0) throw new Error("Cannot generate HII without mission scores.");

        const successRate = scores.filter(s => s.success).length / numMissions;

        // Averages
        const avg = (key: string) => scores.reduce((sum, score) => sum + score.subsystemScores[key], 0) / numMissions;

        const overallIntelligence = scores.reduce((sum, score) => sum + score.overallScore, 0) / numMissions;

        let level: "NONE" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" = "NONE";
        if (successRate >= 0.95) level = "PLATINUM";
        else if (successRate >= 0.90) level = "GOLD";
        else if (successRate >= 0.80) level = "SILVER";
        else if (successRate >= 0.70) level = "BRONZE";

        return {
            version,
            timestamp: Date.now(),
            overallIntelligence,
            subsystems: {
                perception: avg("perception"),
                worldModel: avg("worldModel"),
                conceptFormation: avg("conceptFormation"),
                reasoning: avg("reasoning"),
                planning: avg("planning"),
                simulation: avg("simulation"),
                decisionMaking: avg("decisionMaking"),
                actionExecution: avg("actionExecution"),
                lifelongLearning: avg("lifelongLearning"),
                sensorimotorSkills: avg("sensorimotorSkills")
            },
            metrics: {
                missionSuccessRate: successRate,
                recoveryRate: 0.98, // Mocked for PV-01
                explainability: 1.0, // Assumed if we have traces
                safetyCompliance: 1.0
            },
            certificationLevel: level
        };
    }
}
