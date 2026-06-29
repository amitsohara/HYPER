import { EvolutionStage, EvolutionProposal } from "./evolutionTypes.js";
import { EvolutionEventBus, EvolutionEvents } from "./evolutionEvents.js";

export class EvolutionStateMachine {
    private eventBus = EvolutionEventBus.getInstance();

    public transition(proposal: EvolutionProposal, nextStage: EvolutionStage, context?: any): void {
        const previousStage = proposal.stage;
        proposal.stage = nextStage;
        proposal.updated_at = Date.now();

        this.eventBus.publish(EvolutionEvents.STATE_CHANGED, {
            proposal_id: proposal.proposal_id,
            previous: previousStage,
            current: nextStage,
            context
        });

        // Trigger specific events based on the stage transition
        switch (nextStage) {
            case EvolutionStage.ASSESSING:
                this.eventBus.publish(EvolutionEvents.EVOLUTION_ASSESSMENT_STARTED, { proposal });
                break;
            case EvolutionStage.RESEARCH:
                this.eventBus.publish(EvolutionEvents.RESEARCH_STARTED, { proposal });
                break;
            case EvolutionStage.DESIGN:
                this.eventBus.publish(EvolutionEvents.ARCHITECTURE_APPROVED, { proposal });
                break;
            case EvolutionStage.ENGINEERING:
                this.eventBus.publish(EvolutionEvents.ENGINEERING_STARTED, { proposal });
                break;
            case EvolutionStage.VERIFICATION:
                // Note: The actual success would trigger VERIFICATION_PASSED
                break;
            case EvolutionStage.BENCHMARK:
                this.eventBus.publish(EvolutionEvents.VERIFICATION_PASSED, { proposal });
                break;
            case EvolutionStage.SANDBOX:
                this.eventBus.publish(EvolutionEvents.BENCHMARK_PASSED, { proposal });
                break;
            case EvolutionStage.APPROVAL:
                this.eventBus.publish(EvolutionEvents.SANDBOX_SUCCEEDED, { proposal });
                break;
            case EvolutionStage.DEPLOYMENT:
                this.eventBus.publish(EvolutionEvents.DEPLOYMENT_APPROVED, { proposal });
                break;
            case EvolutionStage.COMPLETE:
                this.eventBus.publish(EvolutionEvents.EVOLUTION_COMPLETED, { proposal });
                break;
            case EvolutionStage.REJECTED:
                this.eventBus.publish(EvolutionEvents.PROPOSAL_REJECTED, { proposal, reason: context?.reason });
                break;
        }
    }
}
