# HEAM Capability Analysis Report
## Version 1.0

### Executive Summary
This report analyzes existing components related to HyperMind's Executive Attention Manager (HEAM). The goal is to identify existing task schedulers, priority queues, and resource managers, determining the gaps for implementing ACP-001.

### 1. Existing Task Schedulers and Resource Managers
- `hmcr/cognitiveScheduler.ts`: Uses rigid observation/attention/reasoning phases. Not dynamic attention.
- `hcc/attention_manager.ts` & `hcc/working_memory.ts`: Existing basic working memory and attention manager but lacks deep integration with HCNS, HWME, and dynamic saliency weighting across goals, world, and concepts.
- `master_orchestrator.ts`: Static pipeline execution.

### 2. Existing Executive Controllers and Goal Managers
- `hcc/goal_stack.ts`: Tracks goals but doesn't dynamically prioritize them via an executive attention system.
- `hwme1/goalModel.ts`: Represents goals as World Objects but doesn't allocate cognitive budget.

### 3. Gap Analysis for HEAM v1.0
To satisfy ACP-001, we must build:
1. **Executive Attention Manager**: The central orchestrator that decides *what* gets reasoning.
2. **Goal, World, and Concept Attention Engines**: To calculate attention scores for goals, world regions, and concepts based on uncertainty, novelty, urgency, and relevance.
3. **Saliency Engine & Cognitive Load Manager**: To compute raw saliency scores and ensure the system doesn't overload.
4. **Focus Controller & Attention History**: To manage attention modes and persist traces of attention shifts for explainability.
5. **Specialist Allocation Engine**: To dynamically allocate work to HCSE specialists based on attention scores.
6. **HCNS Integration**: Communicate all attention shifts via Event Mesh.

### Conclusion
A new subsystem `heam1/` will be created to replace static scheduling with dynamic attention allocation over the World Model (HWME) and Concepts (HCCE), coordinated via the Cognitive Society (HCSE) over the Event Mesh (HCNS).
