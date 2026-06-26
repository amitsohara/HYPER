export class CostEstimator {
  // Approximate pricing for gemini-flash-lite-latest
  // $0.075 per 1M input tokens
  // $0.30 per 1M output tokens
  private static readonly INPUT_PRICE_PER_M = 0.075;
  private static readonly OUTPUT_PRICE_PER_M = 0.30;

  static estimateTokens(text: string): number {
    if (!text) return 0;
    // Rough estimation: 1 token ~ 4 characters
    return Math.ceil(text.length / 4);
  }

  static estimateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1000000) * this.INPUT_PRICE_PER_M;
    const outputCost = (outputTokens / 1000000) * this.OUTPUT_PRICE_PER_M;
    return inputCost + outputCost;
  }

  static formatCost(cost: number): string {
    return `$${cost.toFixed(6)}`;
  }
}
