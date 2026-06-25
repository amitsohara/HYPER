class DependencyGraph:
    def __init__(self):
        self.nodes = {}
        self.edges = {}

    def add_task(self, task):
        self.nodes[task['id']] = task
        if 'dependencies' in task:
            self.edges[task['id']] = task['dependencies']

    def is_ready(self, task_id):
        deps = self.edges.get(task_id, [])
        for dep in deps:
            dep_task = self.nodes.get(dep)
            if not dep_task or dep_task.get('status') != 'completed':
                return False
        return True
