import { EvolutionProposal, EvolutionStage } from "./evolutionTypes.js";
import { EvolutionStateMachine } from "./evolutionStateMachine.js";
import { ExecutiveReporting } from "./executiveReporting.js";
import { EvolutionDecision } from "./evolutionTypes.js";

export class EvolutionLifecycleManager {
    private stateMachine: EvolutionStateMachine;
    private reporting: ExecutiveReporting;

    constructor() {
        this.stateMachine = new EvolutionStateMachine();
        this.reporting = new ExecutiveReporting();
    }

    public startLifecycle(proposal: EvolutionProposal) {
        this.stateMachine.transition(proposal, EvolutionStage.OBSERVING);
        // Additional setup logic
    }

    public advanceLifecycle(proposal: EvolutionProposal, decision: EvolutionDecision) {
        const currentStage = proposal.stage;

        switch (currentStage) {
            case EvolutionStage.OBSERVING:
                this.stateMachine.transition(proposal, EvolutionStage.ASSESSING);
                break;
            case EvolutionStage.ASSESSING:
                this.stateMachine.transition(proposal, EvolutionStage.DECISION);
                break;
            case EvolutionStage.DECISION:
                if (decision === EvolutionDecision.REJECT_EVOLUTION) {
                    this.stateMachine.transition(proposal, EvolutionStage.REJECTED);
                } else {
                    this.stateMachine.transition(proposal, EvolutionStage.RESEARCH);
                }
                break;
            case EvolutionStage.RESEARCH:
                this.stateMachine.transition(proposal, EvolutionStage.DESIGN);
                break;
            case EvolutionStage.DESIGN:
                this.stateMachine.transition(proposal, EvolutionStage.ENGINEERING);
                break;
            case EvolutionStage.ENGINEERING:
                this.stateMachine.transition(proposal, EvolutionStage.VERIFICATION);
                break;
            case EvolutionStage.VERIFICATION:
                this.stateMachine.transition(proposal, EvolutionStage.BENCHMARK);
                break;
            case EvolutionStage.BENCHMARK:
                this.stateMachine.transition(proposal, EvolutionStage.SANDBOX);
                break;
            case EvolutionStage.SANDBOX:
                this.stateMachine.transition(proposal, EvolutionStage.APPROVAL);
                break;
            case EvolutionStage.APPROVAL:
                this.stateMachine.transition(proposal, EvolutionStage.DEPLOYMENT);
                break;
            case EvolutionStage.DEPLOYMENT:
                this.stateMachine.transition(proposal, EvolutionStage.LEARNING);
                break;
            case EvolutionStage.LEARNING:
                this.stateMachine.transition(proposal, EvolutionStage.COMPLETE);
                break;
        }
    }
}
