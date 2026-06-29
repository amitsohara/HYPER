import { SuccessRecord } from "./diagnosticTypes.js";

export class SuccessGenomeRepository {
    private records: Map<string, SuccessRecord> = new Map();

    public save(record: SuccessRecord) {
        this.records.set(record.success_id, record);
    }

    public get(id: string): SuccessRecord | undefined {
        return this.records.get(id);
    }

    public getAll(): SuccessRecord[] {
        return Array.from(this.records.values());
    }
}
