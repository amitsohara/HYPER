# Migration Guide

1. Replace `master_orchestrator.ts` usage with `HyperMindCognitiveSociety` sessions.
2. Wrap existing logic (e.g. `strategic_decision_engine`) in an `ISpecialist` implementation.
3. Register via `society.registerSpecialist()`.