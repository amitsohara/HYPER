import random

class FutureSimulator:
    def __init__(self, memory_engine, knowledge_graph):
        self.memory = memory_engine
        self.graph = knowledge_graph

    def simulate(self, base_state, timeframe_years, domain):
        """
        Simulates progression from a base state across a given timeframe.
        Domains: economy, technology, healthcare, education, environment, politics
        Generates probability ranges instead of certainties.
        """
        events = []
        current_prob = 1.0
        
        for year_offset in range(1, timeframe_years + 1, 5):
            prob = max(0.1, current_prob * random.uniform(0.7, 0.95))
            event_desc = f"Simulated event in {domain} at year +{year_offset}"
            if domain == "economy":
                event_desc = f"Market shift and automation impact scale level {year_offset}"
            elif domain == "technology":
                event_desc = f"Breakthrough in AI and quantum networks at generation {year_offset}"
                
            events.append({
                "year_offset": year_offset,
                "event": event_desc,
                "probability": round(prob, 2)
            })
            current_prob = prob
            
        return events
