export interface CycleTraceEntry {
  step_name: string;
  status: "started" | "completed" | "failed" | "skipped";
  timestamp: number;
  input?: any;
  output?: any;
  error?: any;
  token_usage?: number;
}

export class CycleTrace {
  entries: CycleTraceEntry[] = [];

  addEntry(entry: CycleTraceEntry) {
    this.entries.push(entry);
  }

  getTrace() {
    return this.entries;
  }
}
