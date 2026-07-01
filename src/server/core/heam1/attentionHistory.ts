import { AttentionRecord, AttentionFocusMode } from "./types.js";

export class AttentionHistory {
    private records: AttentionRecord[] = [];

    public persist(record: AttentionRecord): void {
        this.records.push(record);
    }

    public getHistory(limit: number = 100): AttentionRecord[] {
        return this.records.slice(-limit);
    }

    public getLastRecord(): AttentionRecord | undefined {
        return this.records[this.records.length - 1];
    }
}
