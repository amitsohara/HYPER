from pydantic import BaseModel
from typing import List, Dict, Any

class MissionCreate(BaseModel):
    mission_text: str

class MissionResponse(BaseModel):
    mission_id: str
    mission_text: str
    goals: List[Any]
    agents: List[Any]
    synthetic_worlds: List[Any] = []
    scenarios: List[Any]
    best_solution: Any = None
    evaluation: Dict[str, Any]
    reflection: Dict[str, Any] = {}


class ScenarioGenerateRequest(BaseModel):
    topic: str

class AgentRunRequest(BaseModel):
    agent_id: str
    task: str

class MemorySearchRequest(BaseModel):
    query: str
    limit: int = 5
