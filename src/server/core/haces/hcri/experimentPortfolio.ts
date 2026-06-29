import { Experiment, ExperimentResult } from "./researchTypes.ts";

export class ExperimentPortfolio {
    private experiments: Map<string, Experiment> = new Map();
    private results: Map<string, ExperimentResult> = new Map();

    public addExperiment(exp: Experiment) {
        this.experiments.set(exp.experiment_id, exp);
    }

    public getExperiment(id: string): Experiment | undefined {
        return this.experiments.get(id);
    }

    public addResult(res: ExperimentResult) {
        this.results.set(res.result_id, res);
    }

    public getAllExperiments(): Experiment[] {
        return Array.from(this.experiments.values());
    }

    public getAllResults(): ExperimentResult[] {
        return Array.from(this.results.values());
    }
}
