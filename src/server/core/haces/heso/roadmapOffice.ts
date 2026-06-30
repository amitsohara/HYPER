import { v4 as uuidv4 } from "uuid";
import { EvolutionRoadmap, StrategyTimeframe, StrategicObjective } from "./strategyTypes.js";
import { StrategyEventBus, StrategyEvents } from "./strategyEvents.js";
import { StrategyMetrics } from "./strategyMetrics.js";

export class EvolutionRoadmapOffice {
    private eventBus = StrategyEventBus.getInstance();
    private roadmaps: Map<string, EvolutionRoadmap> = new Map();

    public createRoadmap(timeframe: StrategyTimeframe, objectives: StrategicObjective[], version: string): EvolutionRoadmap {
        const roadmap: EvolutionRoadmap = {
            roadmap_id: uuidv4(),
            version,
            timeframe,
            objectives,
            dependencies: [],
            risk_analysis: "Preliminary risk analysis...",
            review_schedule: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
            timestamp: Date.now()
        };

        this.roadmaps.set(roadmap.roadmap_id, roadmap);
        StrategyMetrics.roadmaps_generated++;
        
        this.eventBus.publish(StrategyEvents.ROADMAP_CREATED, roadmap);
        
        return roadmap;
    }

    public getRoadmap(roadmap_id: string): EvolutionRoadmap | undefined {
        return this.roadmaps.get(roadmap_id);
    }
}
