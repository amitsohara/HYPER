import { AbstractionStore } from './abstraction_store.js';
import { Abstraction } from './abstraction_types.js';

export class AbstractionRetriever {
    static retrieve(missionPrompt: string, domain: string): Abstraction[] {
        const all = AbstractionStore.getAll();
        
        // Very basic ranking: sort by support_count, confidence, transferability
        // Filter by domain or high transferability
        const relevant = all.filter(a => {
            const domainMatch = a.source_domains.some(d => d.toLowerCase() === domain.toLowerCase());
            const highTransfer = a.transferability >= 80;
            return domainMatch || highTransfer;
        });

        return relevant.sort((a, b) => {
            const scoreA = a.support_count * 10 + a.confidence + a.transferability;
            const scoreB = b.support_count * 10 + b.confidence + b.transferability;
            return scoreB - scoreA;
        });
    }
}
