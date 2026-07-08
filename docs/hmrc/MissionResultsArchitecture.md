# Mission Results Architecture

## Position in Cognitive Pipeline
HMRC is the terminal phase of the cognitive pipeline:
User Mission -> HOS -> HCNS -> HWME -> HCCE -> HEAM -> HTGE -> HRE -> HPE -> HSTE -> HDME -> HPAE -> HLLE -> **HMRC** -> User

## Data Flow
1. `HyperMindEventMesh` emits `MISSION_COMPLETED` or `MISSION_FAILED`.
2. `MissionResultManager` traps the event and collects traces via `EvidenceAggregationEngine`.
3. `RootCauseAnalysisEngine` evaluates the success/failure reasons.
4. `ConfidenceAssessmentEngine` aggregates confidence scores across 7 key cognitive stages.
5. `MissionScoringEngine` computes the final numeric score (0-100%).
6. `RecommendationEngine` generates prioritized actions.
7. `ExecutiveSummaryEngine` weaves the context into a human-readable summary.
8. `ResultRenderer` packages the outcome for API export and UI rendering.

## Event Subscriptions
- `MISSION_COMPLETED`
- `MISSION_FAILED`
- `ACTION_COMPLETED`
- `ACTION_REJECTED`
- `LEARNING_COMPLETED`

## Event Publications
- `MISSION_RESULT_READY`
- `MISSION_RESULT_UPDATED`
- `MISSION_REPORT_EXPORTED`
