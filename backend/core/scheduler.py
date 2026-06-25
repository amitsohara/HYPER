class Scheduler:
    def __init__(self):
        self.active_tasks = {}
        self.queued_tasks = []
        self.paused_tasks = {}

    def schedule(self, task):
        # Add to queue based on priority
        self.queued_tasks.append(task)
        self.queued_tasks.sort(key=lambda x: x.get('priority', 0), reverse=True)

    def pause(self, task_id):
        if task_id in self.active_tasks:
            task = self.active_tasks.pop(task_id)
            task['status'] = 'paused'
            self.paused_tasks[task_id] = task

    def resume(self, task_id):
        if task_id in self.paused_tasks:
            task = self.paused_tasks.pop(task_id)
            task['status'] = 'queued'
            self.schedule(task)
