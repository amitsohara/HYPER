# Social Cognitive Intelligence Layer (SCIL)

## Overview
The Social Cognitive Intelligence Layer (SCIL) equips HyperMind-X with the ability to model emotional and social states to improve reasoning, decision-making, and planning without actually experiencing emotions itself.

## Components
- **Emotion Detector**: Identifies probabilistic emotional states (confidence, fear, stress).
- **Trust Model**: Estimates trust levels across stakeholders.
- **Motivation Analyzer**: Infers motivations driving individuals and organizations.
- **Conflict Predictor**: Anticipates possible friction points.
- **Leadership Engine**: Recommends appropriate leadership styles.
- **Communication Adapter**: Modifies output styles for specific audiences.
- **Stress Predictor**: Forecasts organizational and operational stress.
- **Social Memory**: Persists social configurations to inform future tasks.
- **Relationship Graph**: Expands the Knowledge Graph with social entities (Person, Organization, Team) and relationships (trusts, supports, competes, etc.).

## Integration
SCIL fits into the `MasterOrchestrator` directly following the `Belief Engine` and informs downstream tasks such as Goal Generation and the `Mission Compiler`.

## API Endpoints
- `POST /api/social/analyze`: Runs SCIL inference.
- `GET /api/social/history`: Retrieves previous social analysis runs.
- `GET /api/social/relationships`: Retrieves social entities in the relationship graph.
- `GET /api/social/trust`: Retrieves evaluated trust networks.
