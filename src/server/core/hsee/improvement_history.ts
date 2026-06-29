import { PolicyCandidate } from "./policy_candidate.js";

export class ImprovementHistory {
    private history: PolicyCandidate[] = [];

    addRecord(policy: PolicyCandidate) {
        this.history.push(policy);
    }
    
    getHistory(): PolicyCandidate[] {
        return this.history;
    }
    
    getDeployed(): PolicyCandidate[] {
        return this.history.filter(p => p.status === "DEPLOYED");
    }
}
