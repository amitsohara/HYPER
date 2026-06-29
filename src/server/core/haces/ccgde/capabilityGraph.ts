import { Capability, CapabilityDependency } from "./gapTypes.js";

export class CapabilityGraph {
    private capabilities: Map<string, Capability> = new Map();
    private dependencies: CapabilityDependency[] = [];

    public addCapability(capability: Capability) {
        this.capabilities.set(capability.capability_id, capability);
    }

    public getCapability(id: string): Capability | undefined {
        return this.capabilities.get(id);
    }

    public getAllCapabilities(): Capability[] {
        return Array.from(this.capabilities.values());
    }

    public addDependency(dep: CapabilityDependency) {
        this.dependencies.push(dep);
    }

    public getDependencies(capabilityId: string): CapabilityDependency[] {
        return this.dependencies.filter(d => d.source_capability_id === capabilityId || d.target_capability_id === capabilityId);
    }
}
