export type MissionMode = "fast" | "balanced" | "deep" | "research" | "simulation";

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export class TokenBudgetManager {
  private static readonly BUDGETS: Record<MissionMode, number> = {
    fast: 10000,
    balanced: 50000,
    deep: 150000,
    research: 100000,
    simulation: 80000
  };

  private mode: MissionMode;
  private maxTokens: number;
  private usedTokens: number = 0;
  private savedTokens: number = 0;

  constructor(mode: MissionMode = "balanced") {
    this.mode = mode;
    this.maxTokens = TokenBudgetManager.BUDGETS[mode] || 50000;
  }

  getMode(): MissionMode {
    return this.mode;
  }

  canAfford(estimatedTokens: number): boolean {
    return this.usedTokens + estimatedTokens <= this.maxTokens;
  }

  consumeTokens(tokens: number) {
    this.usedTokens += tokens;
  }

  recordSavings(tokens: number) {
    this.savedTokens += tokens;
  }

  getUsage() {
    return {
      usedTokens: this.usedTokens,
      maxTokens: this.maxTokens,
      savedTokens: this.savedTokens,
      remaining: this.maxTokens - this.usedTokens
    };
  }
}
