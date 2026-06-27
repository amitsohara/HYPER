# HyperMind Knowledge Evolution System (HKES)

The HyperMind Knowledge Evolution System (HKES) transforms raw, accumulated mission experiences into high-level, reusable cognitive abstractions. It works directly with the **HyperMind Experience & Competence System (HECS)** to close the learning loop.

## Core Purpose
While HECS stores individual experiences, HKES discovers underlying abstractions across those experiences, ensuring that the system generalizes lessons rather than just memorizing them.

It translates knowledge across these layers:
Experiences → Lessons → Patterns → Skills → Strategies → Principles → Mental Models → Concepts

## Components

- **Knowledge Evolution Engine:** Periodically analyzes the Experience Store (HECS) to identify clusters of similar experiences. If a pattern is supported by enough high-quality experiences (minimum 3), it generates candidate abstractions.
- **Abstraction Store & Index:** Securely stores and indexes generated abstractions by type, domain, confidence, and transferability.
- **Abstraction Retriever:** Activated before every mission (in the Cognitive Cycle's Understand Step) to retrieve relevant principles, patterns, and strategies based on the mission context and domain.
- **Abstraction Metrics:** Tracks the total number of abstractions, breakdown by type, average confidence, and average transferability to monitor the health and growth of the Cognitive Core's generalized knowledge.

## Abstraction Types
- `LESSON`: Specific, actionable learning from an experience.
- `PATTERN`: Reusable sequence of events or actions.
- `SKILL`: Highly specific ability acquired through repetition.
- `STRATEGY`: Broad approach to solving a class of problems.
- `PRINCIPLE`: Fundamental truth serving as a foundation for belief or behavior.
- `MENTAL_MODEL`: Framework for thinking about the world and making decisions.
- `CONCEPT`: Abstract idea or general notion.

## Workflow
1. **Experience Collection:** HECS logs experiences after every mission.
2. **Evolution:** Following HECS storage, the `KnowledgeEvolutionEngine` runs. It scans for recurring themes across high-quality experiences.
3. **Storage:** Newly formed abstractions are validated and stored in the `AbstractionStore`.
4. **Retrieval:** Before planning a new mission, the `AbstractionRetriever` fetches highly transferable and domain-relevant abstractions and injects them into the agent's context.

## Validation Rules
- **Support Count:** Abstractions must be supported by a minimum of 3 separate experiences.
- **Confidence:** Abstractions require a minimum confidence score (e.g., 60+) to be stored.
- **Quality:** Abstractions are only drawn from high-quality experiences (quality_score >= 70).

## Pattern Discovery Engine

The **Pattern Discovery Engine** sits between the Experience Store and the Abstraction Store. It is responsible for identifying repeating sequences of actions, conditions, successes, and failures.

### Pipeline
1. **Experience Clusterer**: Groups experiences based on similarity (domain, mission type).
2. **Common Structure Extractor**: Analyzes the cluster to extract common problem structures, constraints, actions, and risks.
3. **Success / Failure Pattern Detectors**: Generates proposed patterns based on common success and failure factors.
4. **Pattern Validator**: Enforces strict quality rules.
5. **Pattern Merger**: Safely merges duplicates by updating support count.

## Heuristic Discovery Engine

The **Heuristic Discovery Engine** converts discovered patterns into practical rules-of-thumb that HyperMind uses during future missions.

### Pipeline
1. **Heuristic Generator**: Prompts the LLM to convert patterns into IF-THEN rules, including strict warnings for failure and contraindications (`avoid_when`).
2. **Heuristic Validator**: Validates heuristics against strict criteria. Rejects vague or generic advice (e.g., "plan carefully").
3. **Heuristic Applicability Scorer**: Scores heuristics against future missions to determine relevance based on domain match, conditions, and transferability.
4. **Heuristic Conflict Detector**: Detects overlapping or contradictory heuristics to surface tradeoffs to the developer.
5. **Heuristic Merger**: Merges duplicated guidelines while maintaining provenance to source patterns and experiences.

### Integration
- **Cognitive Cycle**: Retrieves patterns and heuristics dynamically before mission planning, injecting them into the agent's context during the Understand and Reason steps.
- **Mission Compiler**: Exposes new patterns and heuristics discovered in the developer debug report.

## Causal Discovery Engine

The **Causal Discovery Engine** extracts underlying causal models from experiences, patterns, and heuristics to understand *why* they work, creating a bridge from heuristic rules to robust mental models.

### Pipeline
1. **Causal Link Extractor**: Parses patterns, experiences, and heuristics to extract causal nodes (states, constraints, actions, outcomes) and directed edges (causes, increases, decreases, enables, etc.).
2. **Root Cause Analyzer**: Analyzes the generated causal graph to identify root causes and intermediate mediators.
3. **Intervention Simulator**: Evaluates potential interventions on the causal graph (e.g., if Node A increases Node B risk, an intervention targets Node A) and identifies expected effects.
4. **Causal Validator**: Validates the causal model, ensuring evidence tracing, no unsupported claims, and proper formatting.
5. **Causal Conflict Detector**: Identifies contradictory causal models (e.g., action X increases risk in one model but decreases it in another) and highlights the contextual boundary.
6. **Causal Merger**: Merges duplicated causal graphs while accumulating evidence and support counts.

### Integration
- **Cognitive Cycle**: Retrieves relevant causal models during the Understand and Reason steps to justify strategies and detect missing causal links in planning.
- **Mission Compiler**: Exposes causal graph structures, interventions, and root causes to developers, while providing a streamlined "why it works" explanation in user mode.

## Testing
Unit and integration tests are available for the HKES system to verify its behavior with single-domain pattern extraction, multi-domain heuristic generation, and causal graph discovery.
