# Executive Summary Specification

## Objective
The Executive Summary must be the first artifact presented to the user upon mission completion. It must be non-technical, brief, and actionable.

## Format
- **Objective:** What the mission intended to achieve.
- **Outcome:** The concrete result of the mission.
- **Root Causes:** What factors led to the current state.
- **Unexpected Findings:** Anomalies discovered during the mission.
- **Recommendations:** Ordered by priority.

## Tone
- Direct, objective, and evidence-based.
- Never use internal system jargon like "HILASpecialist found".

## Generation Process
1. `ExecutiveSummaryEngine` extracts the final state from the `HyperMindEventMesh`.
2. It cross-references with `HWME` for environmental context.
3. It uses `HILASpecialist` to summarize the technical traces into the human-readable format.
