import { CognitiveBlueprint, BlueprintStatus, ArchitectureRisk } from "./architectureTypes.js";
import { ArchitecturePolicies } from "./architecturePolicies.js";
import { ArchitectureEventBus, ArchitectureEvents } from "./architectureEvents.js";

export class ArchitectureReviewBoard {
    private eventBus = ArchitectureEventBus.getInstance();

    public reviewBlueprint(blueprint: CognitiveBlueprint, risk: ArchitectureRisk): boolean {
        // Mock review logic based on policies
        const isSafe = ArchitecturePolicies.isRiskAcceptable(risk);
        
        if (isSafe) {
            blueprint.status = BlueprintStatus.APPROVED;
            this.eventBus.publish(ArchitectureEvents.ARCHITECTURE_REVIEWED, { blueprint, approved: true });
            return true;
        } else {
            blueprint.status = BlueprintStatus.REJECTED;
            this.eventBus.publish(ArchitectureEvents.ARCHITECTURE_REVIEWED, { blueprint, approved: false });
            return false;
        }
    }
}
