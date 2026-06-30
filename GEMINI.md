# HyperMind Core 1.0 Architecture Guidelines

From this point onward, every new feature must answer one question:

**"Does this improve the Cognitive Core?"**

If the answer is no, do not add it. Instead, focus on strengthening the shared state, decision quality, learning, or mission execution to maintain the coherence of HyperMind-X.

## Permanent Design Principles
1. HyperMind should distinguish between the real world and imagined worlds. The Cognitive Workspace (HCW) must maintain strict separation between `workspace.world_model.real_world` and `workspace.world_model.imagined_world`.

## HyperMind Research-Driven Development (HRDD)
Every subsystem must follow the HRDD methodology.

1. **Evolution, not Replacement**: Never duplicate an existing module. Extend existing components and preserve backward compatibility.
2. **Capability Analysis First**: Before writing any code, generate a Capability Analysis Report (Existing Modules, Responsibilities, Dependencies, Reusable Components, Missing Components, Integration Points).
3. **Research Lifecycle**: Research -> Theory -> Architecture -> Implementation -> Integration -> Testing -> Documentation -> Validation. Do not skip any stage.
4. **Production Requirements**: Strong typing, error handling, logging, telemetry, security, unit/integration tests, versioning.
5. **Integration**: Every new subsystem must integrate with HMCR, HCW, Memory, Knowledge, Event Bus, Planning, Reasoning, Verification, Evolution. Never create isolated components.
6. **Final Deliverables**: Source Code, Tests, Documentation, Migration Guide, Integration Report, Benchmark Report, Validation Report, Release Notes.
