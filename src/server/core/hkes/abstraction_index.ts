import { Abstraction, AbstractionType } from './abstraction_types.js';

export class AbstractionIndex {
    static byType: Map<string, Set<string>> = new Map();
    static byDomain: Map<string, Set<string>> = new Map();

    static index(abstraction: Abstraction) {
        // Index by type
        if (!this.byType.has(abstraction.abstraction_type)) {
            this.byType.set(abstraction.abstraction_type, new Set());
        }
        this.byType.get(abstraction.abstraction_type)!.add(abstraction.abstraction_id);

        // Index by domain
        abstraction.source_domains.forEach(domain => {
            const d = domain.toLowerCase();
            if (!this.byDomain.has(d)) {
                this.byDomain.set(d, new Set());
            }
            this.byDomain.get(d)!.add(abstraction.abstraction_id);
        });
    }

    static remove(id: string) {
        for (const set of this.byType.values()) set.delete(id);
        for (const set of this.byDomain.values()) set.delete(id);
    }
}
