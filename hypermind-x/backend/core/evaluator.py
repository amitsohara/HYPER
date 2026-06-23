from backend.agents.critic_agent import CriticAgent
import re

class EvaluationEngine:
    async def evaluate(self, mission_text: str, agent_outputs: str):
        critic = CriticAgent()
        task = f"Mission: '{mission_text}'. Outputs: {agent_outputs}"
        eval_score_text = await critic.run(task)
        
        # Extract score out of 100
        score = 85  # default
        match = re.search(r"Score:\s*(\d+)", eval_score_text, re.IGNORECASE)
        if match:
            score = int(match.group(1))

        return {
            "quality_score": score,
            "feedback": eval_score_text[:500] + "...",
            "raw_eval": eval_score_text
        }

evaluator = EvaluationEngine()

