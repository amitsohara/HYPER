# HyperMind-X
**AGI Research Platform & Cognitive Architecture**

HyperMind-X is an advanced research platform transitioning from a standard agent workflow system into a persistent cognitive architecture. Phase 13-15 introduces the Cognitive Architecture, Executive Function, and Autonomous Learning systems.

## Features

- **Cognitive Architecture:** Dynamic belief generation, goal derivation from knowledge gaps, and multi-step long-term planning.
- **Executive Function:** Priority-based task queue, dynamic resource (agent) allocation, and dependency resolution.
- **Autonomous Learning:** Extracts reusable skills from missions, maintains a continuous learning progress score, and evaluates reasoning quality.
- **World Simulation:** Synthetic environments and scenario generation for risk-free strategy evaluation.
- **Mission Debate:** Multi-agent contradiction surfacing and criticism for enhanced decision making.

## Architecture

In this preview environment, the application runs as a unified full-stack application using Node.js (Express + Vite) and React. The backend logic is encapsulated within `/src/server/` to provide immediate execution capabilities for the web UI. 

### Storage Integrations (Production Target)
- **PostgreSQL:** Primary relational store for cognitive states, goals, plans, tasks, skills, and evaluations (see `schema.sql`).
- **Neo4j:** Graph database for mapping `[:DEPENDS_ON]` relationships between tasks, and `[:CONTRADICTS]` relationships between beliefs.
- **Qdrant:** Vector database for semantic retrieval of past missions and relevant skills.

*(Note: In the local containerized preview, these databases are simulated in-memory to provide instant visual feedback on the frontend dashboards without external provisioning overhead.)*

## Setup and Running

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Environment Variables:**
   Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`.
3. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Testing the Pipeline

1. Open the **Mission Command** tab.
2. Enter a mission prompt (e.g., "Analyze the socioeconomic impacts of autonomous AI networks over the next decade").
3. Launch the mission.
4. Navigate through the **Cognitive Architecture**, **Executive Function**, and **Autonomous Learning** tabs to observe the system generate beliefs, derive tasks, and extract reusable skills dynamically.

## Python Modules (Reference)
The theoretical backend core is structured under `/backend/core/` for Python integration, mirroring the active TypeScript implementations in `/src/server/`.
