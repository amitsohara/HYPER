export interface ExperienceObject {
  experience_id: string;
  mission_id: string;
  mission: string;
  context: any;
  action_taken: any;
  predicted_outcome: any;
  actual_outcome: any | "pending";
  prediction_error: any | null;
  success_score: number;
  novelty_score: number;
  importance_score: number;
  emotional_or_social_context: any;
  lessons_learned: string[];
  beliefs_changed: string[];
  skills_reinforced: string[];
  timestamp: number;
}

export interface CycleState {
  cycle_id: string;
  mission_id: string;
  mission: string;
  user_context: any;
  mode: string;
  status: "idle" | "running" | "completed" | "failed";
  current_step: string;
  started_at: number;
  completed_at?: number;

  observation?: any;
  understanding?: any;
  imagination?: any;
  reasoning?: any;
  prediction?: any;
  decision?: any;
  action?: any;
  outcome?: any;
  experience?: ExperienceObject;
  reflection?: any;
  learning?: any;
  belief_updates?: any;
  improvements?: any;

  hcc_state_before?: any;
  hcc_state_after?: any;

  modules_used: string[];
  modules_skipped: string[];
  modules_failed: string[];
  token_usage: number;
  estimated_cost: number;
  errors: any[];
  warnings: any[];
  trace: any[];
}
