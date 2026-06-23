from pydantic import BaseModel
from typing import List, Dict, Any

class MissionCreate(BaseModel):
    mission_text: str

class MissionResponse(BaseModel):
    mission_id: str
    mission_text: str
    goals: List[Dict[str, Any]]
    agents: List[Dict[str, Any]]
    scenarios: List[Dict[str, Any]]
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
