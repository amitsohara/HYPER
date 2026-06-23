import os
import uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
import json

from backend.database.db import get_db, engine, Base
from backend.database.models import Mission
from backend.schemas.schemas import (
    MissionCreate, MissionResponse, ScenarioGenerateRequest, AgentRunRequest, MemorySearchRequest
)
from backend.core.goal_engine import goal_engine
from backend.core.agent_factory import agent_factory
from backend.core.synthmind import synthmind_engine
from backend.core.evaluator import evaluator
from backend.core.memory import memory_core
from backend.core.reflection_engine import reflection_engine

# Initialize DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HyperMind-X", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/mission", response_model=MissionResponse)
async def create_mission(mission: MissionCreate, db: Session = Depends(get_db)):
    mission_id = str(uuid.uuid4())
    goals = await goal_engine.decompose_mission(mission.mission_text)
    
    # Phase 4 SynthMind Learning Loop
    from backend.core.learning_loop import learning_loop
    loop_results = await learning_loop.run_loop(mission.mission_text)
    
    worlds = loop_results["worlds"]
    scenario_results = loop_results["scenario_results"]
    best_solution = loop_results["best_solution"]
    reflection = loop_results["reflection"]
    
    # Store agents just for response format logging
    agents = [{"agent_type": "researcher", "output": best_solution["solution"]} if best_solution else {"agent_type": "researcher", "output": ""}]
    
    # Mocking standard evaluator output for response
    evaluation = {
        "quality_score": best_solution["score"] if best_solution else 0,
        "feedback": "Evaluated across multiple synthetic worlds."
    }
    
    await memory_core.store(json.dumps(best_solution), metadata={"mission_id": mission_id, "reflection": reflection})
    
    mission_record = Mission(
        id=mission_id,
        text=mission.mission_text,
        goals=goals,
        agents=agents,
        scenarios=scenario_results,
        evaluation=evaluation,
        reflection=reflection
    )
    
    try:
        db.add(mission_record)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    return MissionResponse(
        mission_id=mission_id,
        mission_text=mission.mission_text,
        goals=goals,
        agents=agents,
        scenarios=[scenario],
        evaluation=evaluation,
        reflection=reflection
    )

@app.get("/missions", response_model=List[MissionResponse])
def list_missions(db: Session = Depends(get_db)):
    try:
        missions = db.query(Mission).order_by(Mission.created_at.desc()).all()
        return [
            MissionResponse(
                mission_id=m.id,
                mission_text=m.text,
                goals=m.goals,
                agents=m.agents,
                scenarios=m.scenarios,
                evaluation=m.evaluation,
                reflection=m.reflection
            ) for m in missions
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/mission/{id}", response_model=MissionResponse)
def get_mission(id: str, db: Session = Depends(get_db)):
    try:
        m = db.query(Mission).filter(Mission.id == id).first()
        if not m:
            raise HTTPException(status_code=404, detail="Mission not found")
        return MissionResponse(
            mission_id=m.id,
            mission_text=m.text,
            goals=m.goals,
            agents=m.agents,
            scenarios=m.scenarios,
            evaluation=m.evaluation,
            reflection=m.reflection
        )
    except Exception:
        raise HTTPException(status_code=404, detail="Mission not found")


@app.post("/synthmind/generate")
async def generate_synthmind(req: ScenarioGenerateRequest):
    return await synthmind_engine.generate_scenario(req.topic)

@app.post("/agents/run")
async def run_agent(req: AgentRunRequest):
    agent = agent_factory.provision_agent(req.agent_id)
    result = await agent.run(req.task)
    return {"agent": agent.name, "result": result}

@app.post("/memory/search")
async def search_memory(req: MemorySearchRequest):
    result = await memory_core.search(req.query, req.limit)
    return {"results": result}

frontend_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.isdir(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
