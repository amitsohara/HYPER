class PriorityEngine:
    def __init__(self):
        pass

    def calculate(self, task):
        """
        Dynamically calculates priority based on task type, urgency, 
        and strategic value.
        """
        base = 50
        if task.get('type') == 'mission_critical':
            base += 40
        elif task.get('type') == 'background_research':
            base -= 20
        
        urgency = task.get('urgency', 0)
        return min(100, base + urgency)
