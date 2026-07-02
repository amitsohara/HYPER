export * from "./types.js";
export * from "./validators/Validators.js";
export * from "./engines/TestingEngines.js";
export * from "./managers/IntegrationManagers.js";

import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { MissionScenarioManager, ScenarioRegistry, StressTestEngine, FaultInjectionEngine } from "./engines/TestingEngines.js";
import { MissionRunner, ValidationOrchestrator, CertificationEngine } from "./managers/IntegrationManagers.js";

export class IntegrationValidationManager {
    public registry = new ScenarioRegistry();
    public scenarioManager = new MissionScenarioManager(this.registry);
    public runner: MissionRunner;
    public orchestrator = new ValidationOrchestrator();
    public certificationEngine = new CertificationEngine();
    public faultEngine = new FaultInjectionEngine();
    public stressEngine = new StressTestEngine();

    constructor(eventMesh: HyperMindEventMesh) {
        this.runner = new MissionRunner(eventMesh);
    }

    async runGrandChallenge() {
        const scenarios = this.registry.getAll();
        const reports = [];

        console.log(`Starting GRAND CHALLENGE with ${scenarios.length} scenarios...`);
        
        for (const scenario of scenarios) {
            console.log(`Executing Scenario: ${scenario.name}`);
            const report = await this.runner.run(scenario);
            const isValid = this.orchestrator.validateReport(report, scenario);
            report.success = isValid;
            reports.push(report);
        }

        const cert = this.certificationEngine.certify(reports);
        
        console.log(`\n--- GRAND CHALLENGE COMPLETE ---`);
        console.log(`Certification Level: ${cert.level}`);
        console.log(`Success Rate: ${cert.missionSuccessRate * 100}%`);
        
        return cert;
    }
}
