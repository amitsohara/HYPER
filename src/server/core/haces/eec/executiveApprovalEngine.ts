import { EvolutionDecision, EvolutionStage, EvolutionProposal } from "./evolutionTypes.js";
import { EvolutionEventBus, EvolutionEvents } from "./evolutionEvents.js";
import { ExecutiveGovernance } from "./executiveGovernance.js";

export class ExecutiveApprovalEngine {
    private governance: ExecutiveGovernance;

    constructor() {
        this.governance = new ExecutiveGovernance();
    }

    public evaluateApproval(proposal: EvolutionProposal): { approved: boolean; decision: EvolutionDecision; reason: string } {
        if (!this.governance.evaluateProposalCompleteness(proposal)) {
            return { approved: false, decision: EvolutionDecision.REJECT_EVOLUTION, reason: "Incomplete proposal." };
        }

        const ejs = proposal.ejs || this.governance.computeEJS(proposal);
        if (ejs < 50) {
            return { approved: false, decision: EvolutionDecision.REJECT_EVOLUTION, reason: `Low EJS score: ${ejs}.` };
        }

        if (proposal.risk_assessment && proposal.risk_assessment.overall_risk_score > 75) {
            return { approved: false, decision: EvolutionDecision.REJECT_EVOLUTION, reason: `Risk score too high: ${proposal.risk_assessment.overall_risk_score}.` };
        }

        // Determine decision type based on proposal structure
        let decision = EvolutionDecision.UPDATE_POLICIES;
        if (proposal.affected_cognitive_systems.includes("architecture")) {
            decision = EvolutionDecision.LAUNCH_ARCHITECTURE_INVESTIGATION;
        } else if (proposal.estimated_engineering_effort > 200) {
            decision = EvolutionDecision.LAUNCH_ENGINEERING;
        }

        return { approved: true, decision, reason: `Approved with EJS: ${ejs}.` };
    }
}
