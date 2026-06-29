# HyperMind World Model Engine (HWME) - Part 1

The Reality Representation Core (RRC) is responsible for converting the user's mission and raw prompt text into a structured, internal, executable representation of reality within the HyperMind Cognitive Workspace (HCW).

## Core Principle

HyperMind modules should **never reason directly from prompt text**. Text is ambiguous, flat, and lacks interconnected meaning. Instead, the Reality Representation Core builds a multi-dimensional graph of the world, and subsequent modules (Understand, Reason, Predict, Decide) query this world model.

## World Components

The World Model represents:
- **Entities:** Persons, organizations, resources, locations, systems, software, environments, etc.
- **Relationships:** How entities interact (PART_OF, DEPENDS_ON, PRODUCES, CONSUMES, CONFLICTS_WITH, etc.).
- **Systems:** Complex collections of subsystems, dependencies, inputs, outputs, and constraints.
- **Processes:** Sequence-based operations with durations, inputs, outputs, and risks.
- **Constraints:** Limiting factors such as budget, time, physics (gravity, radiation), laws, etc.
- **Resources:** Quantifiable or conceptual assets like water, money, people, computing power, data.
- **Environments:** Locations with specific conditions and hazards.
- **Agents:** Goal-oriented, active participants (humans, AIs, robots).
- **Events:** Incidents or occurrences with probability and impact.

## Cognitive Cycle Integration

- **Observe Step:** Parses the raw mission statement and context using Gemini. The RRC constructs the World Model and attaches it to the HCW's `world_model` property.
- **Understand/Reason Steps:** These steps read directly from the `world_model` in the workspace to ground logic.
- **Mission Compiler:** The Developer Mode report exposes the World Model graph metrics (entity count, constraint count, etc.).

## Endpoints

- \`POST /api/hwme/world\`
- \`GET /api/hwme/world/:id\`
- \`GET /api/hwme/world/:id/entities\`
- \`GET /api/hwme/world/:id/systems\`
- \`GET /api/hwme/world/:id/relationships\`
- \`GET /api/hwme/world/:id/resources\`
