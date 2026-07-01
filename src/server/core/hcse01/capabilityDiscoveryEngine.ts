import { SpecialistRegistry } from "./specialistRegistry.js";
import { ISpecialist, CognitiveDomain, CognitiveRole } from "./types.js";

export class CapabilityDiscoveryEngine {
    constructor(private registry: SpecialistRegistry) {}

    public findSpecialistsByDomain(domain: CognitiveDomain): ISpecialist[] {
        return this.registry.getActiveSpecialists().filter(specialist => 
            specialist.getIdentity().capabilities.some(c => c.domain === domain)
        );
    }

    public findSpecialistsByRole(role: CognitiveRole): ISpecialist[] {
        return this.registry.getActiveSpecialists().filter(specialist => 
            specialist.getIdentity().capabilities.some(c => c.roles.includes(role))
        );
    }

    public findBestSpecialistForTask(taskDescription: string): ISpecialist | undefined {
        const active = this.registry.getActiveSpecialists();
        if (active.length === 0) return undefined;

        let bestSpecialist: ISpecialist | undefined;
        let highestConfidence = -1;

        for (const specialist of active) {
            const confidence = specialist.getConfidence(taskDescription);
            if (confidence > highestConfidence) {
                highestConfidence = confidence;
                bestSpecialist = specialist;
            }
        }

        return bestSpecialist;
    }
}
