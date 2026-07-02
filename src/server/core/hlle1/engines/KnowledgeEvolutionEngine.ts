import { LearningArtifact, ValidationStatus, KnowledgeUpdate } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveDomain } from "../../hcns01/types.js";

export class KnowledgeValidationEngine {
    validate(artifact: LearningArtifact): boolean {
        // Mock validation: check confidence and evidence
        if (artifact.confidence > 0.8) {
            artifact.validationStatus = ValidationStatus.SIMULATION_VERIFIED;
            return true;
        }
        artifact.validationStatus = ValidationStatus.REJECTED;
        return false;
    }
}

export class KnowledgeEvolutionEngine {
    constructor(private eventMesh: HyperMindEventMesh) {}

    proposePromotion(artifact: LearningArtifact) {
        if (artifact.validationStatus === ValidationStatus.SIMULATION_VERIFIED) {
            artifact.validationStatus = ValidationStatus.EXECUTIVE_APPROVED; // Mocking HDME approval here for simplicity
            
            if (artifact.validationStatus === ValidationStatus.EXECUTIVE_APPROVED) {
                this.promote(artifact);
            }
        }
    }

    private promote(artifact: LearningArtifact) {
        artifact.validationStatus = ValidationStatus.PROMOTED;

        const update: KnowledgeUpdate = {
            id: `upd-${uuidv4()}`,
            traceId: artifact.traceId,
            researchId: artifact.researchId,
            artifactId: artifact.id,
            targetSystem: "HWME", // example
            updatePayload: { type: artifact.type, data: artifact },
            timestamp: Date.now(),
            confidence: artifact.confidence,
            provenance: "HLLE_EVOLUTION_ENGINE",
            version: 1,
            validationStatus: ValidationStatus.PROMOTED,
            lifecycle: "APPLIED",
            telemetry: {}
        };

        this.eventMesh.publish({
            type: "KNOWLEDGE_UPDATED",
            domain: CognitiveDomain.LEARNING, // Need to ensure CognitiveDomain has LEARNING or use SYSTEM
            priority: 1,
            source: "HLLE",
            payload: { update }
        });
    }
}
