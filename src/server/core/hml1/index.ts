import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { HyperMindOS } from "../hos1/index.js";
import { MissionScenarioRegistry, BenchmarkScenarioGenerator } from "./managers/MissionManagers.js";
import { MissionExecutor, MissionReplayEngine } from "./engines/MissionEngines.js";
import { MissionScoreEngine, CertificationEngine } from "./engines/ScoreEngines.js";
import { HyperMindIntelligenceIndex, MissionScore } from "./types.js";

export * from "./types.js";
export * from "./managers/MissionManagers.js";
export * from "./engines/MissionEngines.js";
export * from "./engines/ScoreEngines.js";
export * from "./engines/EvaluationEngines.js";

export class MissionLaboratory {
    public registry = new MissionScenarioRegistry();
    public scenarioGenerator = new BenchmarkScenarioGenerator(this.registry);
    public executor: MissionExecutor;
    public replayEngine = new MissionReplayEngine();
    public scoreEngine = new MissionScoreEngine();
    public certEngine = new CertificationEngine();

    constructor(eventMesh: HyperMindEventMesh, hos: HyperMindOS) {
        this.executor = new MissionExecutor(hos, eventMesh);
    }

    async runGrandChallenge(version: string): Promise<HyperMindIntelligenceIndex> {
        console.log(`\n=== Starting HyperMind Grand Challenge (v${version}) ===\n`);
        
        const scenarios = this.registry.getAll();
        const scores: MissionScore[] = [];

        for (const scenario of scenarios) {
            console.log(`[HML] Executing Mission: ${scenario.name}...`);
            const trace = await this.executor.execute(scenario);
            
            // Assume success for all mock executions that return a complete trace
            const success = trace.events.some(e => e.type === "MISSION_COMPLETED");
            
            const score = this.scoreEngine.scoreMission(scenario, trace, success);
            scores.push(score);
            
            console.log(`[HML] Mission Score: ${(score.overallScore * 100).toFixed(1)}% | Success: ${score.success}`);
        }

        const hii = this.certEngine.generateHII(scores, version);
        this.printHII(hii);
        
        return hii;
    }

    private printHII(hii: HyperMindIntelligenceIndex) {
        console.log(`\n=================================================`);
        console.log(`      HyperMind Intelligence Index (HII)         `);
        console.log(`=================================================`);
        console.log(`Version: ${hii.version}`);
        console.log(`Overall Intelligence: ${(hii.overallIntelligence * 100).toFixed(1)}%\n`);
        
        console.log(`Perception:            ${(hii.subsystems.perception * 100).toFixed(1)}%`);
        console.log(`World Model:           ${(hii.subsystems.worldModel * 100).toFixed(1)}%`);
        console.log(`Concept Formation:     ${(hii.subsystems.conceptFormation * 100).toFixed(1)}%`);
        console.log(`Reasoning:             ${(hii.subsystems.reasoning * 100).toFixed(1)}%`);
        console.log(`Planning:              ${(hii.subsystems.planning * 100).toFixed(1)}%`);
        console.log(`Simulation:            ${(hii.subsystems.simulation * 100).toFixed(1)}%`);
        console.log(`Decision Making:       ${(hii.subsystems.decisionMaking * 100).toFixed(1)}%`);
        console.log(`Action Execution:      ${(hii.subsystems.actionExecution * 100).toFixed(1)}%`);
        console.log(`Lifelong Learning:     ${(hii.subsystems.lifelongLearning * 100).toFixed(1)}%`);
        console.log(`Sensorimotor Skills:   ${(hii.subsystems.sensorimotorSkills * 100).toFixed(1)}%\n`);

        console.log(`Mission Success Rate:  ${(hii.metrics.missionSuccessRate * 100).toFixed(1)}%`);
        console.log(`Recovery Rate:         ${(hii.metrics.recoveryRate * 100).toFixed(1)}%`);
        console.log(`Explainability:        ${(hii.metrics.explainability * 100).toFixed(1)}%`);
        console.log(`Safety Compliance:     ${(hii.metrics.safetyCompliance * 100).toFixed(1)}%\n`);

        console.log(`Certification: ${hii.certificationLevel}`);
        console.log(`=================================================\n`);
    }
}
