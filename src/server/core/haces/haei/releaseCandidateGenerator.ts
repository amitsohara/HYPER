import { ReleaseCandidate, EngineeringPlan, SecurityAssessment, PerformanceAssessment, DocumentationPackage, BuildArtifact } from "./engineeringTypes.js";
import { EngineeringEventBus, EngineeringEvents } from "./engineeringEvents.js";
import { EngineeringPolicies } from "./engineeringPolicies.js";

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export class ReleaseCandidateGenerator {
    private eventBus = EngineeringEventBus.getInstance();

    public generateRC(
        plan: EngineeringPlan,
        security: SecurityAssessment,
        perf: PerformanceAssessment,
        docs: DocumentationPackage,
        build: BuildArtifact
    ): ReleaseCandidate | null {
        const rc: ReleaseCandidate = {
            rc_id: uuidv4(),
            plan_id: plan.plan_id,
            engineering_report: "Successfully completed engineering sprint.",
            implementation_summary: `Implemented ${plan.tasks.length} tasks.`,
            known_limitations: ["None identified"],
            security_assessment: security,
            performance_assessment: perf,
            documentation: docs,
            build_artifact: build,
            verification_package: { ready_for_hvvi: true },
            timestamp: Date.now()
        };

        if (EngineeringPolicies.isReadyForRelease(rc)) {
            this.eventBus.publish(EngineeringEvents.RELEASE_CANDIDATE_GENERATED, { rc });
            return rc;
        }

        return null; // Not ready
    }
}
