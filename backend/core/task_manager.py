class TaskManager:
    def __init__(self, scheduler, priority_engine, dependency_graph, resource_manager):
        self.scheduler = scheduler
        self.priority = priority_engine
        self.deps = dependency_graph
        self.resources = resource_manager

    def submit_task(self, task):
        # 1. calculate priority
        task['priority'] = self.priority.calculate(task)
        # 2. check dependencies
        self.deps.add_task(task)
        # 3. schedule
        self.scheduler.schedule(task)
        
    def pause_task(self, task_id):
        self.scheduler.pause(task_id)

    def resume_task(self, task_id):
        self.scheduler.resume(task_id)
