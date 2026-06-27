import { Abstraction, AbstractionType } from './abstraction_types.js';
import { AbstractionIndex } from './abstraction_index.js';
import { AbstractionMetrics } from './abstraction_metrics.js';

export class AbstractionStore {
    private static store: Map<string, Abstraction> = new Map();

    static storeAbstraction(abstraction: Abstraction) {
        this.store.set(abstraction.abstraction_id, abstraction);
        AbstractionIndex.index(abstraction);
        AbstractionMetrics.update();
    }

    static updateAbstraction(abstraction: Abstraction) {
        abstraction.updated_at = Date.now();
        abstraction.version += 1;
        this.store.set(abstraction.abstraction_id, abstraction);
        AbstractionIndex.index(abstraction);
    }

    static deleteAbstraction(id: string) {
        this.store.delete(id);
        AbstractionIndex.remove(id);
        AbstractionMetrics.update();
    }

    static getAbstraction(id: string): Abstraction | undefined {
        return this.store.get(id);
    }

    static getAll(): Abstraction[] {
        return Array.from(this.store.values());
    }

    static searchByType(type: AbstractionType): Abstraction[] {
        const ids = AbstractionIndex.byType.get(type) || new Set();
        return Array.from(ids).map(id => this.getAbstraction(id)).filter(Boolean) as Abstraction[];
    }

    static searchByDomain(domain: string): Abstraction[] {
        const d = domain.toLowerCase();
        const ids = AbstractionIndex.byDomain.get(d) || new Set();
        return Array.from(ids).map(id => this.getAbstraction(id)).filter(Boolean) as Abstraction[];
    }
    
    static clear() {
        this.store.clear();
        AbstractionIndex.byType.clear();
        AbstractionIndex.byDomain.clear();
        AbstractionMetrics.update();
    }
}
