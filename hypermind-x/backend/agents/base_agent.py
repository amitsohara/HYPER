from abc import ABC, abstractmethod

class BaseAgent(ABC):
    def __init__(self, name: str, role: str, model: str = "llama3"):
        self.name = name
        self.role = role
        self.model = model

    @abstractmethod
    async def run(self, task: str) -> str:
        pass
