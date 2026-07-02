import { ResourceAllocation, ResourceBudget } from "../types.js";
import { v4 as uuidv4 } from "uuid";

export class ResourceManager {
    private allocations: Map<string, ResourceAllocation> = new Map();
    private globalBudget: ResourceBudget = {
        cpuShares: 100,
        memoryMb: 16384,
        gpuShares: 100,
        diskMb: 102400,
        eventThroughputMax: 10000
    };
    
    private usedBudget: ResourceBudget = {
        cpuShares: 0,
        memoryMb: 0,
        gpuShares: 0,
        diskMb: 0,
        eventThroughputMax: 0
    };

    allocate(targetId: string, request: ResourceBudget): ResourceAllocation | null {
        // Check if enough resources
        if (
            this.usedBudget.cpuShares + request.cpuShares > this.globalBudget.cpuShares ||
            this.usedBudget.memoryMb + request.memoryMb > this.globalBudget.memoryMb
        ) {
            return null; // Resource exhausted
        }

        const allocation: ResourceAllocation = {
            id: `alloc-${uuidv4()}`,
            targetId,
            budget: request,
            status: "ALLOCATED"
        };

        this.usedBudget.cpuShares += request.cpuShares;
        this.usedBudget.memoryMb += request.memoryMb;
        
        this.allocations.set(allocation.id, allocation);
        return allocation;
    }

    revoke(allocationId: string) {
        const alloc = this.allocations.get(allocationId);
        if (alloc && alloc.status === "ALLOCATED") {
            alloc.status = "REVOKED";
            this.usedBudget.cpuShares -= alloc.budget.cpuShares;
            this.usedBudget.memoryMb -= alloc.budget.memoryMb;
        }
    }
}
