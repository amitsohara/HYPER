import { TelemetryCollector } from "./telemetryCollector.js";
import { DigitalTwin } from "./digitalTwin.js";
import { CognitiveHealthIndex } from "./cognitiveHealthIndex.js";
import { PerformanceObservatory } from "./performanceObservatory.js";
import { BottleneckDetector } from "./bottleneckDetector.js";
import { EvolutionReadinessAssessor } from "./evolutionReadiness.js";
import { TrendAnalyzer } from "./trendAnalyzer.js";
import { PredictiveAnalytics } from "./predictiveAnalytics.js";
import { ObservatoryQueryEngine } from "./queryEngine.js";
import { DashboardGenerator } from "./dashboardGenerator.js";
import { ObservabilityMetrics } from "./observabilityMetrics.js";

export class CognitiveObservatory {
    public telemetry = new TelemetryCollector();
    public digitalTwin = new DigitalTwin();
    public healthIndex = new CognitiveHealthIndex(this.telemetry);
    public performance = new PerformanceObservatory(this.telemetry);
    public bottleneckDetector = new BottleneckDetector();
    public evolutionReadiness = new EvolutionReadinessAssessor();
    public trendAnalyzer = new TrendAnalyzer(this.telemetry);
    public predictiveAnalytics = new PredictiveAnalytics();
    public queryEngine = new ObservatoryQueryEngine(this.digitalTwin);
    public dashboards = new DashboardGenerator(this.queryEngine);

    public runObservationCycle() {
        // Collect snapshots
        const perfSnapshot = this.performance.takeSnapshot();
        const healthProfile = this.healthIndex.computeHealth();
        
        // Detect bottlenecks
        const bottlenecks = this.bottleneckDetector.detect(healthProfile);
        
        // Assess readiness
        const readiness = this.evolutionReadiness.assess();
        
        // Update Digital Twin
        this.digitalTwin.updateState({
            health_profile: healthProfile,
            performance: perfSnapshot,
            active_bottlenecks: this.bottleneckDetector.getActiveBottlenecks(),
            evolution_readiness: readiness
        });
        
        // Generate forecasts
        this.predictiveAnalytics.generateForecast("REASONING_QUALITY");
    }

    public getMetrics(): ObservabilityMetrics {
        const state = this.digitalTwin.getState();
        return {
            total_samples_collected: this.telemetry.getSamples().length,
            active_bottlenecks_count: state.active_bottlenecks.length,
            health_score: state.health_profile.overall_health_score,
            readiness_score: state.evolution_readiness.readiness_score
        };
    }
}
