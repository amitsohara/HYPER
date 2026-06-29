import { EvolutionProposal } from "./evolutionTypes.js";

export class EvolutionProposalManager {
    private proposals: Map<string, EvolutionProposal> = new Map();

    public saveProposal(proposal: EvolutionProposal) {
        this.proposals.set(proposal.proposal_id, proposal);
    }

    public getProposal(proposalId: string): EvolutionProposal | undefined {
        return this.proposals.get(proposalId);
    }

    public getAllProposals(): EvolutionProposal[] {
        return Array.from(this.proposals.values());
    }
}
