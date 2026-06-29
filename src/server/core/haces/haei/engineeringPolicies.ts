import { SecurityAssessment, ReleaseCandidate } from "./engineeringTypes.js";

export class EngineeringPolicies {
    public static isSecurityAcceptable(assessment: SecurityAssessment): boolean {
        return assessment.vulnerabilities.length === 0 && assessment.secrets_detected.length === 0;
    }

    public static isReadyForRelease(rc: ReleaseCandidate): boolean {
        return this.isSecurityAcceptable(rc.security_assessment) &&
               rc.documentation.developer_docs !== "" &&
               rc.build_artifact.artifacts.length > 0;
    }
}
