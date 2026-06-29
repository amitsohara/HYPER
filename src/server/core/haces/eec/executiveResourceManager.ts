import { EvolutionMetrics, ResourceAllocation } from "./evolutionTypes.js";

export class ExecutiveResourceManager {
    private totalResources: ResourceAllocation = {
        compute_budget: 1000000,
        token_budget: 50000000,
        engineering_budget: 10000,
        simulation_budget: 50000,
        benchmarking_budget: 20000,
        research_budget: 30000,
        storage_budget: 1000000
    };

    private allocatedResources: ResourceAllocation = {
        compute_budget: 0,
        token_budget: 0,
        engineering_budget: 0,
        simulation_budget: 0,
        benchmarking_budget: 0,
        research_budget: 0,
        storage_budget: 0
    };

    public allocate(request: ResourceAllocation): boolean {
        if (this.canAllocate(request)) {
            this.allocatedResources.compute_budget += request.compute_budget;
            this.allocatedResources.token_budget += request.token_budget;
            this.allocatedResources.engineering_budget += request.engineering_budget;
            this.allocatedResources.simulation_budget += request.simulation_budget;
            this.allocatedResources.benchmarking_budget += request.benchmarking_budget;
            this.allocatedResources.research_budget += request.research_budget;
            this.allocatedResources.storage_budget += request.storage_budget;
            return true;
        }
        return false;
    }

    public canAllocate(request: ResourceAllocation): boolean {
        return (
            this.totalResources.compute_budget - this.allocatedResources.compute_budget >= request.compute_budget &&
            this.totalResources.token_budget - this.allocatedResources.token_budget >= request.token_budget &&
            this.totalResources.engineering_budget - this.allocatedResources.engineering_budget >= request.engineering_budget &&
            this.totalResources.simulation_budget - this.allocatedResources.simulation_budget >= request.simulation_budget &&
            this.totalResources.benchmarking_budget - this.allocatedResources.benchmarking_budget >= request.benchmarking_budget &&
            this.totalResources.research_budget - this.allocatedResources.research_budget >= request.research_budget &&
            this.totalResources.storage_budget - this.allocatedResources.storage_budget >= request.storage_budget
        );
    }

    public release(freed: ResourceAllocation): void {
        this.allocatedResources.compute_budget -= freed.compute_budget;
        this.allocatedResources.token_budget -= freed.token_budget;
        this.allocatedResources.engineering_budget -= freed.engineering_budget;
        this.allocatedResources.simulation_budget -= freed.simulation_budget;
        this.allocatedResources.benchmarking_budget -= freed.benchmarking_budget;
        this.allocatedResources.research_budget -= freed.research_budget;
        this.allocatedResources.storage_budget -= freed.storage_budget;
    }

    public getAllocatedResources(): ResourceAllocation {
        return { ...this.allocatedResources };
    }
}
