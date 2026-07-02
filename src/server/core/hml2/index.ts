import { HyperMindEventMesh } from "../hcns01/eventMesh.js";
import { LiveMissionRunner, MissionAnalyticsEngine, MissionComparisonEngine } from "./engines.js";

export class RealMissionManager {
    public liveRunner: LiveMissionRunner;
    public analytics: MissionAnalyticsEngine;
    public comparison: MissionComparisonEngine;

    constructor(private eventMesh: HyperMindEventMesh) {
        this.liveRunner = new LiveMissionRunner(eventMesh);
        this.analytics = new MissionAnalyticsEngine();
        this.comparison = new MissionComparisonEngine();
    }
}
