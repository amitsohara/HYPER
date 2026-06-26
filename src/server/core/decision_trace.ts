export class DecisionTrace {
  static generate(steps: { name: string; details?: any }[]): any[] {
    return steps.map((step, index) => ({
      step_number: index + 1,
      name: step.name,
      details: step.details,
      timestamp: new Date().toISOString()
    }));
  }
}
