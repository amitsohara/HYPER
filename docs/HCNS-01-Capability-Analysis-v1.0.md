# HCNS-01 Capability Analysis Report
## Version 1.0

### Executive Summary
This report analyzes the existing HyperMind codebase to identify all existing event systems, message buses, observers, queues, schedulers, blackboards, telemetry, and runtime interfaces. The purpose of this analysis is to prepare for the implementation of HCNS-01 (HyperMind Core Event Mesh), which will replace fragmented communication with a unified, observable, secure, and type-safe event-driven cognitive communication layer.

### 1. Existing Event Systems & Message Buses
The current architecture relies heavily on disparate singleton Event Buses tailored to specific subsystems. The following have been identified:
- **`CognitiveEventBus`** (`src/server/core/hmcr/cognitiveEvents.ts`)
- **`StateEventBus`** (`src/server/core/hcc/state_event_bus.ts`)
- **`StrategyEventBus`** (`src/server/core/haces/heso/strategyEvents.ts`)
- **`MemoryEventBus`** (`src/server/core/haces/hem/memoryEvents.ts`)
- **`ResearchEventBus`** (`src/server/core/haces/hcri/researchEvents.ts`)
- **`ArchitectureEventBus`** (`src/server/core/haces/hcai/architectureEvents.ts`)
- **`BenchmarkEventBus`** (`src/server/core/haces/hbii/benchmarkEvents.ts`)
- **`VerificationEventBus`** (`src/server/core/haces/hvvi/verificationEvents.ts`)

These implementations are virtually identical (Singleton pattern, `subscribe`, `publish`), representing significant code duplication and preventing cross-domain observability.

### 2. Existing Queues & Schedulers
- **`CognitiveScheduler`** (`src/server/core/hmcr/cognitiveScheduler.ts`): Provides simple sequencing of `SpecialistType` execution.
- **`CycleScheduler`** (`src/server/core/cognitive_cycle/cycle_scheduler.ts`)
- **`SimulationScheduler`** (`src/server/core/hsde/simulation_scheduler.ts`)
- Ad-hoc array-based queues observed in UI components (e.g., `AutonomousDashboard.tsx`).

### 3. Existing Blackboards
- **`CognitiveBlackboard`** (`src/server/core/hmcr/cognitiveBlackboard.ts`): Stores cognitive execution results across specialists in a session. Notified via `CognitiveEventBus`.

### 4. Existing Telemetry & Metrics
- Various `*Metrics` singletons exist per subsystem (e.g., `CognitiveMetrics`, `StrategyMetrics`, `MemoryMetrics`). These track basic counters (e.g., `scenarios_simulated`) but lack deep trace IDs, correlation IDs, or timeline linkage.

### 5. Architectural Conflicts & Duplicate Code
- **Fragmentation**: Event buses cannot talk to each other. An event originating in `CognitiveEventBus` cannot be directly traced to a resulting action in `MemoryEventBus`.
- **Global Singletons**: The heavy reliance on static `getInstance()` for Event Buses poses a risk for testing (state leakage) and horizontal scaling.
- **Lack of Event Standardization**: The payloads across `CognitiveEvents`, `StrategyEvents`, etc. are mostly `any` or loosely typed. There is no central Event ID, Trace ID, or Correlation ID system.
- **Persistence**: Event Buses operate purely in memory. There is no durable replayability or audit logging.

### 6. Reusable Code & Integration Points
- **Reusable Patterns**: The `subscribe`/`publish` paradigm is already understood by the system, so introducing HCNS-01 will be a natural refactor. The domain separation (HMCR vs HACES) informs the topic/domain routing strategy for the new Event Mesh.
- **Integration Targets**: 
  - `hmcr`: Replace `CognitiveEventBus`
  - `hcc/hcw`: Replace `StateEventBus`
  - `haces/*`: Replace domain-specific event buses
  - Existing Metrics: Need to be tied into the HCNS-01 `EventTraceManager`.

### Conclusion
A unified `HyperMindEventMesh` is strictly required. It must implement a standard Event Model (including Trace IDs, Correlation IDs, and structured payloads), priority queues, and domain-based topic routing, providing a single communication backbone that can be observed and persisted globally.
