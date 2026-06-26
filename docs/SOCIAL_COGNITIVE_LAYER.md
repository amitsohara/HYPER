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
SCIL is officially one of the **five permanent core layers** of HyperMind-X, acting as the bridge between objective cognitive reasoning and actionable mission planning:
1. Perception Layer
2. Cognitive Intelligence Layer
3. **Social Cognitive Intelligence Layer (SCIL)**
4. Reasoning & Planning Layer
5. Mission Compiler

This makes HyperMind-X significantly more effective for business, leadership, education, healthcare, negotiation, and strategic decision-making because it explicitly models how people and organizations behave, complementing the system's technical capabilities.

## API Endpoints
- `POST /api/social/analyze`: Runs SCIL inference.
- `GET /api/social/history`: Retrieves previous social analysis runs.
- `GET /api/social/relationships`: Retrieves social entities in the relationship graph.
- `GET /api/social/trust`: Retrieves evaluated trust networks.
