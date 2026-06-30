export const VerificationMetrics = {
    total_verifications: 0,
    approved_releases: 0,
    rejected_releases: 0,
    average_confidence: 0,
    
    update(report: any, decision: any) {
        this.total_verifications++;
        if (decision.status === 'APPROVED' || decision.status === 'APPROVED_WITH_CONDITIONS') {
            this.approved_releases++;
        } else {
            this.rejected_releases++;
        }
    },
    
    getSummary() {
        return {
            total_verifications: this.total_verifications,
            approved_releases: this.approved_releases,
            rejected_releases: this.rejected_releases,
            approval_rate: this.total_verifications ? (this.approved_releases / this.total_verifications) : 0
        };
    }
};
