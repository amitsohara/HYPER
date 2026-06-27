# HyperMind Cognitive Workspace (HCW)

HyperMind Cognitive Workspace (HCW) is the shared internal thinking space of the HyperMind-X cognitive architecture. It acts as the "RAM" of cognition, allowing various cognitive modules to read and write context in a structured, observable, and queryable graph-based format.

## Architecture

Instead of each cognitive module processing inputs and generating isolated JSON outputs, all modules interact with a central workspace. 

- **Observe** -> Creates the Workspace and injects the Mission node.
- **Understand** -> Adds context, goals, boundaries.
- **Reason** -> Analyzes information, adds logical connections.
- **Predict** -> Generates possible outcomes and risk nodes.
- **Decide** -> Connects decisions to reasoning.
- **HKES / HECS** -> Abstractions and historical experiences are retrieved and linked into the workspace.

## Key Concepts

### Graph-Based Representation
The workspace state is stored as a graph:
- **Nodes**: Represent distinct concepts such as `MISSION`, `EVIDENCE`, `DECISION`, `CAUSAL_FACTOR`, `HEURISTIC`.
- **Edges**: Represent relationships like `DEPENDS_ON`, `CAUSES`, `PREDICTS`, `CONTRADICTS`.

### Workspace Patches
Modules modify the workspace exclusively via **Patches**. 
- A patch contains nodes and edges added, removed, or updated.
- Every patch must include a `reason` and identify the `module_name` that generated it (Provenance).
- Patches are validated before applying to prevent invalid edge targets or missing justifications.

### Validation & Merging
- **Validator**: Enforces structural and logical consistency (e.g., rejecting decisions without supporting reasoning edges).
- **Merger**: Automatically deduplicates identical nodes/edges injected by different modules while preserving combined provenance and updating confidence scores.

### Snapshots
The workspace supports point-in-time snapshots to capture the cognitive state at significant transitions (e.g., at the end of a cycle step).

## Integration
- **HCC (HyperMind Cognitive Core)**: Stores lightweight references (`workspace_id`, `workspace_summary`) instead of duplicating the entire graph, keeping the core state clean.
- **HECS (HyperMind Experience Capture System)**: When an experience is saved, it captures the `workspace_id` to allow deep historical tracing of how a decision was made.
- **Mission Compiler**: The developer mode reads directly from the HCW to provide deep visibility into the agent's thought process, module contributions, and contradictions.

## API Endpoints

- \`POST /api/hcw/workspace\` - Create a new workspace.
- \`GET /api/hcw/workspace/:id\` - Retrieve full workspace state.
- \`GET /api/hcw/workspace/:id/summary\` - Get lightweight summary.
- \`GET /api/hcw/workspace/:id/graph\` - Get node and edge arrays.
- \`GET /api/hcw/workspace/:id/patches\` - View patch history.
- \`GET /api/hcw/workspace/:id/snapshots\` - View snapshot history.
- \`GET /api/hcw/workspace/:id/metrics\` - Get workspace metrics (node counts, etc.).
