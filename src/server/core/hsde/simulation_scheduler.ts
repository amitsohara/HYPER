import { SimulationBranch } from "./simulation_branch.js";

export class SimulationScheduler {
    static schedule(branches: SimulationBranch[]): SimulationBranch[] {
        // Scheduler could prioritize based on resources
        return branches; // Return them all to run immediately in this mock
    }
}
