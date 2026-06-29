import { FailureRecord } from "./diagnosticTypes.js";

export class FailureGenomeRepository {
    private records: Map<string, FailureRecord> = new Map();

    public save(record: FailureRecord) {
        this.records.set(record.failure_id, record);
    }

    public get(id: string): FailureRecord | undefined {
        return this.records.get(id);
    }

    public getAll(): FailureRecord[] {
        return Array.from(this.records.values());
    }
}
