import { EvolutionDecisionEngine } from "./evolutionDecisionEngine.js";
import { EvolutionLifecycleManager } from "./evolutionLifecycleManager.js";
import { EvolutionPriorityManager } from "./evolutionPriorityManager.js";
import { EvolutionProposalManager } from "./evolutionProposalManager.js";
import { ExecutiveGovernance } from "./executiveGovernance.js";
import { ExecutiveRiskAssessment } from "./executiveRiskAssessment.js";
import { ExecutiveResourceManager } from "./executiveResourceManager.js";
import { ExecutiveApprovalEngine } from "./executiveApprovalEngine.js";
import { ExecutiveReporting } from "./executiveReporting.js";
import { EvolutionMetrics, EvolutionStage, EvolutionDecision } from "./evolutionTypes.js";

export class EvolutionExecutiveController {
    public decisionEngine = new EvolutionDecisionEngine();
    public lifecycleManager = new EvolutionLifecycleManager();
    public priorityManager = new EvolutionPriorityManager();
    public proposalManager = new EvolutionProposalManager();
    public governance = new ExecutiveGovernance();
    public riskAssessment = new ExecutiveRiskAssessment();
    public resourceManager = new ExecutiveResourceManager();
    public approvalEngine = new ExecutiveApprovalEngine();
    public reporting = new ExecutiveReporting();

    private metrics: EvolutionMetrics = {
        total_proposals: 0,
        approved_proposals: 0,
        rejected_proposals: 0,
        average_ejs: 0,
        resources_consumed: {
            compute_budget: 0,
            token_budget: 0,
            engineering_budget: 0,
            simulation_budget: 0,
            benchmarking_budget: 0,
            research_budget: 0,
            storage_budget: 0
        }
    };

    public handleMissionCompleted(missionData: any) {
        // 1. Mission Outcome Monitoring -> Assessment
        const proposal = this.decisionEngine.generateAssessment(missionData);
        if (!proposal) return; // No action needed

        this.metrics.total_proposals++;

        // 2. Risk Governance
        proposal.risk_assessment = this.riskAssessment.assess(proposal);

        // 3. EJS Computation
        proposal.ejs = this.governance.computeEJS(proposal);
        this.metrics.average_ejs = ((this.metrics.average_ejs * (this.metrics.total_proposals - 1)) + proposal.ejs) / this.metrics.total_proposals;

        // 4. Executive Approval
        const { approved, decision, reason } = this.approvalEngine.evaluateApproval(proposal);
        
        if (!approved) {
            proposal.stage = EvolutionStage.REJECTED;
            this.metrics.rejected_proposals++;
            this.proposalManager.saveProposal(proposal);
            const report = this.reporting.generateReport(proposal, decision, "REJECTED");
            console.log(`[EEC] Proposal ${proposal.proposal_id} Rejected: ${reason}`);
            return report;
        }

        // 5. Resource Allocation
        if (!this.resourceManager.allocate(proposal.required_resources)) {
            proposal.stage = EvolutionStage.FAILED;
            this.metrics.rejected_proposals++;
            this.proposalManager.saveProposal(proposal);
            console.log(`[EEC] Proposal ${proposal.proposal_id} Failed: Insufficient resources`);
            return this.reporting.generateReport(proposal, decision, "FAILED_RESOURCES");
        }

        // 6. Queue for Execution
        this.metrics.approved_proposals++;
        this.proposalManager.saveProposal(proposal);
        this.priorityManager.enqueue(proposal);
        this.lifecycleManager.startLifecycle(proposal);

        console.log(`[EEC] Proposal ${proposal.proposal_id} Approved and Queued. EJS: ${proposal.ejs}`);
        return this.reporting.generateReport(proposal, decision, "APPROVED");
    }

    public processQueue() {
        const proposal = this.priorityManager.dequeue();
        if (proposal) {
            // For now, simulate advancing the lifecycle immediately.
            // In a real system, this would be asynchronous and driven by external completions.
            this.lifecycleManager.advanceLifecycle(proposal, EvolutionDecision.UPDATE_POLICIES);
        }
    }
    
    public getMetrics() {
        return {
            ...this.metrics,
            allocated_resources: this.resourceManager.getAllocatedResources()
        };
    }
}
