import os
import uuid
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List

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
    agents = agent_factory.create_team_for_mission(goals)
    scenario = await synthmind_engine.generate_scenario(mission.mission_text)
    
    agent_outputs = []
    for agent_info in agents:
        agent = agent_factory.provision_agent(agent_info["agent_type"])
        output = await agent.run(f"Goal for {agent_info['agent_type']} on {mission.mission_text}")
        agent_outputs.append(f"{agent.name}: {output}")
        
    actual_output = "\n".join(agent_outputs)
    
    evaluation = await evaluator.evaluate(mission.mission_text, actual_output)
    await memory_core.store(actual_output, metadata={"mission_id": mission_id})
    
    mission_record = Mission(
        id=mission_id,
        text=mission.mission_text,
        goals=goals,
        agents=agents,
        scenarios=[scenario],
        evaluation=evaluation
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
        evaluation=evaluation
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
                evaluation=m.evaluation
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
            evaluation=m.evaluation
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
