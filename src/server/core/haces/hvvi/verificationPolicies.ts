export const VerificationPolicies = {
    STRICT_MODE: true, // Reject any deviations from architecture
    MIN_CONFIDENCE_THRESHOLD: 85,
    REQUIRE_TRACEABILITY: true,
    REQUIRE_ZERO_VULNERABILITIES: true,
    
    evaluate(report: any): string[] {
        const violations = [];
        if (this.REQUIRE_TRACEABILITY && !report.traceability.is_traceable) {
            violations.push("Traceability is incomplete.");
        }
        if (this.REQUIRE_ZERO_VULNERABILITIES && report.security.vulnerabilities_found.length > 0) {
            violations.push("Security vulnerabilities detected.");
        }
        return violations;
    }
};
