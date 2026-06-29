import { SimulationManager } from "./simulation_manager.js";
import { SimulationScenario } from "./simulation_scenario.js";
import { SimulationBranch } from "./simulation_branch.js";
import { SimulationStatus } from "./simulation_types.js";
import { SimulationRunner } from "./simulation_runner.js";
import { SimulationValidator } from "./simulation_validator.js";
import { SimulationRanker } from "./simulation_ranker.js";
import { DiscoveryEngine } from "./discovery_engine.js";
import { DiscoveryRepository } from "./discovery_repository.js";
import { DiscoveryRanker } from "./discovery_ranker.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class SimulationEngine {
    manager: SimulationManager = new SimulationManager();
    repository: DiscoveryRepository = new DiscoveryRepository();
    
    simulate(mission: string, context: any): SimulationBranch[] {
        // Generate alternative scenarios/branches based on mission
        const branches: SimulationBranch[] = [];
        
        // Mock generation
        const numBranches = mission.includes("Impossible") ? 1 : 3;
        
        for (let i = 0; i < numBranches; i++) {
             const assumptions = [];
             if (mission.includes("Impossible") || context?.impossible) {
                  assumptions.push("Physics violation");
             } else {
                  assumptions.push(`Assumption ${i}`);
             }
             
             const branch: SimulationBranch = {
                 branch_id: uuidv4(),
                 scenario: {
                     scenario_id: uuidv4(),
                     mission,
                     assumptions,
                     constraints: ["Time", "Budget"],
                     alternative_strategies: [`Strategy ${i}`],
                     alternative_designs: [],
                     alternative_mechanisms: []
                 },
                 world: {
                     world_id: uuidv4(),
                     base_reality_snapshot: {},
                     current_state: { state_id: uuidv4(), timestamp: Date.now(), entities: [], resources: [], relationships: [], processes_active: [] },
                     history: []
                 },
                 timeline: [Date.now()],
                 status: SimulationStatus.CREATED,
                 confidence: 50,
                 created_at: Date.now(),
                 updated_at: Date.now()
             };
             
             const val = SimulationValidator.validate(branch);
             if (!val.valid) {
                  branch.status = SimulationStatus.REJECTED;
                  console.warn(`Branch rejected: ${val.errors.join(", ")}`);
             } else {
                  SimulationRunner.execute(branch);
             }
             
             this.manager.addBranch(branch);
             branches.push(branch);
        }
        
        // Post execution discovery
        const completed = branches.filter(b => b.status === SimulationStatus.COMPLETED);
        if (completed.length > 0) {
             const discoveries = DiscoveryEngine.analyze(completed);
             for (const d of discoveries) {
                 this.repository.add(d);
             }
        }
        
        return branches;
    }
    
    getRankedStrategies() {
        return SimulationRanker.rank(this.manager.getAllBranches().filter(b => b.status === SimulationStatus.COMPLETED));
    }
    
    getDiscoveries() {
        return DiscoveryRanker.rank(this.repository.getAll());
    }
}
