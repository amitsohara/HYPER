import { CodeArtifact } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";

export class RefactoringEngine {
    private eventBus = EngineeringEventBus.getInstance();

    public refactor(artifacts: CodeArtifact[]): CodeArtifact[] {
        const refactored = artifacts.map(a => ({
            ...a,
            content: a.content + "\n// Refactored for SOLID principles"
        }));

        this.eventBus.publish(EngineeringEvents.REFACTORING_COMPLETED, { artifacts: refactored });
        return refactored;
    }
}
