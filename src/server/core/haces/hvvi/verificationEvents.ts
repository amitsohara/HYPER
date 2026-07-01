import { HyperMindEventMesh, CognitiveDomain, EventPriority } from "../../hcns01/index.js";

export enum VerificationEvents {
    VERIFICATION_STARTED = "HVVI_VERIFICATION_STARTED",
    VERIFICATION_COMPLETED = "HVVI_VERIFICATION_COMPLETED",
    TRACEABILITY_VERIFIED = "HVVI_TRACEABILITY_VERIFIED",
    FUNCTIONAL_VERIFICATION_PASSED = "HVVI_FUNCTIONAL_VERIFICATION_PASSED",
    ARCHITECTURE_COMPLIANCE_PASSED = "HVVI_ARCHITECTURE_COMPLIANCE_PASSED",
    SCIENTIFIC_VALIDATION_PASSED = "HVVI_SCIENTIFIC_VALIDATION_PASSED",
    SECURITY_VERIFICATION_COMPLETED = "HVVI_SECURITY_VERIFICATION_COMPLETED",
    REGRESSION_DETECTED = "HVVI_REGRESSION_DETECTED",
    ENGINEERING_CERTIFIED = "HVVI_ENGINEERING_CERTIFIED",
    RELEASE_APPROVED = "HVVI_RELEASE_APPROVED",
    RELEASE_REJECTED = "HVVI_RELEASE_REJECTED"
}

// Register these schemas so the Mesh allows them
const mesh = HyperMindEventMesh.getInstance();
Object.values(VerificationEvents).forEach(type => {
    if (!mesh.registry.isRegistered(type)) {
        mesh.registerEventType({
            type,
            domain: CognitiveDomain.VERIFICATION,
            description: `Verification Event: ${type}`
        });
    }
});

/**
 * Backward compatible facade pointing to HyperMindEventMesh (HCNS-01)
 */
export class VerificationEventBus {
    private static instance: VerificationEventBus;
    private mesh = HyperMindEventMesh.getInstance();

    private constructor() {}

    public static getInstance(): VerificationEventBus {
        if (!VerificationEventBus.instance) {
            VerificationEventBus.instance = new VerificationEventBus();
        }
        return VerificationEventBus.instance;
    }

    public subscribe(event: VerificationEvents, callback: (data: any) => void) {
        this.mesh.subscribe(event, (meshEvent) => {
            callback(meshEvent.payload);
        });
    }

    public publish(event: VerificationEvents, data: any) {
        console.log(`[HCNS-01] [HVVI] Publishing: ${event}`);
        this.mesh.publish({
            type: event,
            domain: CognitiveDomain.VERIFICATION,
            priority: EventPriority.NORMAL,
            source: "HVVI",
            payload: data
        });
    }
}

