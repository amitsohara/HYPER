import { HyperMindCognitiveSociety } from "../hcse01/societyManager.js";
import { ISpecialist } from "../hcse01/types.js";

export class SpecialistAllocationEngine {
    constructor(private society: HyperMindCognitiveSociety) {}

    public selectBestSpecialist(taskDescription: string, requiredCapability?: string): ISpecialist | undefined {
        const specialists = this.society.registry.getActiveSpecialists();
        if (specialists.length === 0) return undefined;

        let bestSpec: ISpecialist | undefined;
        let highestScore = -1;

        for (const spec of specialists) {
            const confidence = spec.getConfidence(taskDescription);
            const identity = spec.getIdentity();
            
            let score = confidence * identity.availability * (1 / (identity.priority || 1));
            
            if (requiredCapability && identity.capabilities.some(c => c.name === requiredCapability)) {
                score += 1.0;
            }

            if (score > highestScore) {
                highestScore = score;
                bestSpec = spec;
            }
        }

        return bestSpec;
    }
}
