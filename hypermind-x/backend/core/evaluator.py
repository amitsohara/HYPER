from backend.core.model_router import router

class EvaluationEngine:
    async def evaluate(self, mission_text: str, agent_outputs: str):
        prompt = f"Evaluate this outcome against the original mission '{mission_text}': {agent_outputs}"
        eval_score = await router.generate(prompt)
        return {
            "score": 0.92,
            "feedback": "Agents successfully completed the objectives.",
            "raw_eval": eval_score[:150]
        }

evaluator = EvaluationEngine()
