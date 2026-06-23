# HyperMind-X Backend

An experimental AI research operating system built with FastAPI, PostgreSQL, Qdrant, and Ollama.

## Modules
1. **Goal Engine**: Breaks down high-level missions into executable steps.
2. **Agent Factory**: Dynamically instantiates Planner, Researcher, Critic, and Creator agents.
3. **SynthMind Engine**: Generates synthetic scenarios for training/tests.
4. **Evaluation Engine**: Validates mission success.
5. **Memory Core**: Semantic recall structure via Qdrant.
6. **Model Router**: Manages local Ollama model interactions.

## Local Setup Without Docker

1. Ensure Python 3.11+ is installed.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Start the FastAPI server (you need to run this from inside the `hypermind-x` root directory):
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```

## Setup via Docker

1. Setup Ollama natively on your host machine to serve `llama3`.
2. Run Docker Compose to provision PostgreSQL, Qdrant, and the FastAPI service:
   ```bash
   docker-compose up -d --build
   ```

## Swagger API Docs

Once running, navigate to:
[http://localhost:8000/docs](http://localhost:8000/docs)
