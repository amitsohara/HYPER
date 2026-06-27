# HyperMind-X
**AGI Research Platform & Cognitive Architecture**

HyperMind-X is an advanced research platform transitioning from a standard agent workflow system into a persistent cognitive architecture. It operates utilizing a unified five-layer core architecture.

## Core Layers

1. **Perception Layer:** Gathers and integrates initial data and contextual inputs.
2. **Cognitive Intelligence Layer:** Dynamic belief generation, goal derivation from knowledge gaps, and continuous learning.
3. **Social Cognitive Intelligence Layer (SCIL):** Emotion detection, empathy, trust modeling, and motivation analysis.
4. **Reasoning & Planning Layer:** Multi-step long-term planning, executive task queues, and dynamic resource allocation.
5. **HyperMind Experience & Competence System (HECS):** Transforms completed missions into a permanent cognitive experience. Tracks transferable skills and builds a reusable Experience Graph.
6. **Mission Compiler:** The final aggregation layer. Converts outputs from all internal modules into one clean, useful, executive-style mission result.

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

## Testing the Mission Compiler

1. Open the **Mission Command** tab in the web UI.
2. Enter a mission prompt (e.g., "Build a ₹100 crore robotics company").
3. Launch the mission.
4. Once completed, you will receive a clean, executive-level **Mission Report Dashboard** containing summaries, roadmaps, risk assessments, and action plans.
5. Click **"Show Technical Details"** to open Developer Mode and inspect the raw output from all internal sub-modules (World Model, SCIL, Discovery, Society, etc.).

## Python Modules (Reference)
The theoretical backend core is structured under `/backend/` for Python integration, mirroring the active TypeScript implementations in `/src/server/`. The Mission Compiler python skeleton is available in `backend/mission_compiler/`.
