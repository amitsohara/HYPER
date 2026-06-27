import { AbstractionStore } from './abstraction_store.js';
import { AbstractionType } from './abstraction_types.js';

export class AbstractionMetrics {
    static metrics = {
        total_abstractions: 0,
        by_type: {} as Record<string, number>,
        average_confidence: 0,
        average_transferability: 0
    };

    static update() {
        const all = AbstractionStore.getAll();
        this.metrics.total_abstractions = all.length;
        
        const typeCounts: Record<string, number> = {};
        let totalConf = 0;
        let totalTrans = 0;

        all.forEach(a => {
            typeCounts[a.abstraction_type] = (typeCounts[a.abstraction_type] || 0) + 1;
            totalConf += a.confidence;
            totalTrans += a.transferability;
        });

        this.metrics.by_type = typeCounts;
        this.metrics.average_confidence = all.length > 0 ? totalConf / all.length : 0;
        this.metrics.average_transferability = all.length > 0 ? totalTrans / all.length : 0;
    }
}
