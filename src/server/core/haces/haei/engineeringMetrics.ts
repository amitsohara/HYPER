import { EngineeringDigitalTwin } from "./engineeringDigitalTwin.js";
import { EngineeringGenomeRepository } from "./engineeringGenome.js";

export class EngineeringMetricsCollector {
    public static collectMetrics(twin: EngineeringDigitalTwin, genomes: EngineeringGenomeRepository) {
        const state = twin.getState();
        const genome = genomes.getGenome();

        return {
            active_projects: state.active_projects.length,
            test_coverage: state.test_coverage,
            security_posture: state.security_posture,
            build_history_length: genome.build_history.length,
            technical_debt: state.technical_debt
        };
    }
}
