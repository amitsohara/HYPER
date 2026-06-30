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

export class VerificationEventBus {
    private static instance: VerificationEventBus;
    private listeners: Record<string, ((data: any) => void)[]> = {};

    private constructor() {}

    public static getInstance(): VerificationEventBus {
        if (!VerificationEventBus.instance) {
            VerificationEventBus.instance = new VerificationEventBus();
        }
        return VerificationEventBus.instance;
    }

    public subscribe(event: VerificationEvents, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    public publish(event: VerificationEvents, data: any) {
        console.log(`[HVVI Event] ${event}`, data);
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}
