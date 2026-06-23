from backend.core.model_router import router

class ReflectionEngine:
    async def reflect(self, mission_text: str, agent_outputs: str, evaluation: str) -> dict:
        prompt = f"Given the mission '{mission_text}', the agent outputs '{agent_outputs[:500]}...', and the evaluation '{evaluation[:200]}...', create lessons learned and improvement suggestions for the future. Return JSON format with 'lessons_learned' and 'improvement_suggestion'."
        response = await router.generate(prompt)
        
        # very basic JSON extraction fallback just in case
        lessons = "Ensure better decomposition of ambiguous tasks."
        suggestion = "Involve Creator earlier in the process."
        
        try:
            import json
            import re
            match = re.search(r"\{.*\}", response, re.DOTALL)
            if match:
                data = json.loads(match.group(0))
                lessons = data.get("lessons_learned", lessons)
                suggestion = data.get("improvement_suggestion", suggestion)
        except Exception:
            pass

        return {
            "lessons_learned": lessons,
            "improvement_suggestion": suggestion
        }

reflection_engine = ReflectionEngine()
