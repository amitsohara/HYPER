import { DiscoveryCandidate } from "./discovery_candidate.js";

export class DiscoveryRepository {
    private discoveries: Map<string, DiscoveryCandidate> = new Map();

    add(discovery: DiscoveryCandidate) {
        this.discoveries.set(discovery.candidate_id, discovery);
    }
    
    get(id: string): DiscoveryCandidate | undefined {
        return this.discoveries.get(id);
    }
    
    getAll(): DiscoveryCandidate[] {
        return Array.from(this.discoveries.values());
    }
}
