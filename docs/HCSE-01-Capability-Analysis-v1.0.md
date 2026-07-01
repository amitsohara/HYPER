# HCSE-01 Capability Analysis Report
## Version 1.0

### Executive Summary
This report analyzes the existing HyperMind codebase to identify components related to cognitive society orchestration, specialist registration, and session management. The goal is to prepare for the implementation of HCSE-01 (HyperMind Cognitive Society Core), a permanent organizational layer that replaces ad-hoc orchestration with a structured, HCNS-integrated society of specialists.

### 1. Existing Managers and Orchestrators
- **`master_orchestrator.ts`**: Currently orchestrates higher-level workflows, combining multiple modules (e.g., `capability_planner`, `evidence_collector`, etc.). This acts as a monolithic controller rather than a dynamic society manager.
- **`cognitive_cycle/cycle_scheduler.ts` & `hmcr/cognitiveScheduler.ts`**: Handle rigid sequences of cognitive phases (`OBSERVATION` -> `ATTENTION` -> ...). These assume a static pipeline of specialists.
- **`hcc/state_manager.ts` (and related hcc files)**: Maintain global cognitive state (`cognitive_state.ts`, `goal_stack.ts`, `working_memory.ts`), but are tightly coupled and not dynamically populated by specialists.

### 2. Registries and Agent Systems
- **`capability_registry.ts`**: Contains a static, hardcoded list of `CapabilityDef` objects (e.g., `imagination_engine`, `social_cognition`). It does not support dynamic registration, lifecycle management, or health tracking.
- **Various standalone engines**: `strategic_decision_engine.ts`, `autonomous_learning_engine.ts`, `meta_cognition_engine.ts`, `web_search_agent.ts`. These act as individual agents or engines but are hardcoded into specific pipelines.

### 3. Task Systems and Schedulers
- Tasks are currently defined via `CognitiveTask` in `cognitiveTypes.ts` and passed explicitly.
- There is no dynamic "Capability Discovery" mechanism where an abstract task is routed to the most appropriate, available specialist via HCNS.

### 4. Lifecycle and Coordination Mechanisms
- Lifecycle is mostly procedural (e.g., calling `.execute()` on a sequence of classes).
- Coordination is largely direct function calls or through the legacy `StateEventBus` / `CognitiveEventBus` which are being replaced by HCNS-01.

### 5. HCNS Integration
- The newly developed **HCNS-01 (HyperMind Core Event Mesh)** is available and functional. Existing event buses (`CognitiveEventBus`, `StateEventBus`, etc.) have compatibility wrappers for it. HCSE-01 will rely **exclusively** on HCNS-01 for all inter-specialist communication.

### Conclusion & Gap Analysis
The existing architecture uses procedural orchestration (`master_orchestrator`, `cognitiveScheduler`) and static registries (`capability_registry.ts`). 
HCSE-01 is needed to provide:
1. **Dynamic Registration**: A `SpecialistRegistry` supporting capabilities, health, and availability.
2. **Society Lifecycle**: A `SocietyManager` replacing the rigid script-based execution.
3. **Session Management**: A `CognitiveSessionManager` to track user interactions and route them.
4. **HCNS-Only Communication**: Enforcing that specialists do not hold direct references to each other.

Implementation of HCSE-01 will extend the concept of `SpecialistType` and integrate existing engines (like HMCR, HEM, etc.) as pluggable Specialists in the Society.
