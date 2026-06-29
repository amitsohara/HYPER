# HyperMind Core 1.0 Architecture Guidelines

From this point onward, every new feature must answer one question:

**"Does this improve the Cognitive Core?"**

If the answer is no, do not add it. Instead, focus on strengthening the shared state, decision quality, learning, or mission execution to maintain the coherence of HyperMind-X.

## Permanent Design Principles
1. HyperMind should distinguish between the real world and imagined worlds. The Cognitive Workspace (HCW) must maintain strict separation between `workspace.world_model.real_world` and `workspace.world_model.imagined_world`.
