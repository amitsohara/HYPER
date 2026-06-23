from sqlalchemy import Column, String, Text, DateTime, JSON
from datetime import datetime
from backend.database.db import Base

class Mission(Base):
    __tablename__ = "missions"
    id = Column(String, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    goals = Column(JSON)
    agents = Column(JSON)
    synthetic_worlds = Column(JSON, default=list)
    scenarios = Column(JSON)
    best_solution = Column(JSON, default=dict)
    evaluation = Column(JSON)
    reflection = Column(JSON, default=dict)

