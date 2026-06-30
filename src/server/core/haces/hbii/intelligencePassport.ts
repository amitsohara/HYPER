import { v4 as uuidv4 } from "uuid";
import { IntelligencePassport, IntelligenceProfile, CapabilityCategory } from "./benchmarkTypes.js";
import { BenchmarkEventBus, BenchmarkEvents } from "./benchmarkEvents.js";

export class IntelligencePassportSystem {
    private eventBus = BenchmarkEventBus.getInstance();

    public generatePassport(profile: IntelligenceProfile, safetyScore: number): IntelligencePassport {
        const passport: IntelligencePassport = {
            passport_id: uuidv4(),
            version: profile.version,
            issue_date: Date.now(),
            profile,
            general_intelligence_index: profile.continuous_intelligence_index,
            safety_certification_score: safetyScore
        };

        this.eventBus.publish(BenchmarkEvents.PASSPORT_GENERATED, passport);
        
        return passport;
    }
}
