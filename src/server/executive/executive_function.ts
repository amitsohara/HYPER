export interface ExecutiveState {
    tasks: any[];
    agents: any[];
}

const defaultState: ExecutiveState = {
    tasks: [
        { 
            id: "t1", 
            name: "Global trend analysis", 
            description: "Analyze market trends and macro factors.",
            status: "running", 
            priority: 85, 
            allocated_agent: "agent_1",
            estimated_difficulty: 7,
            expected_value: 90,
            risk_level: 0.2,
            created_at: new Date().toISOString()
        },
        { 
            id: "t2", 
            name: "Synthesize findings", 
            description: "Aggregate data from trend analysis into actionable insights.",
            status: "paused", 
            priority: 60, 
            dependencies: ["t1"], 
            allocated_agent: null,
            estimated_difficulty: 5,
            expected_value: 80,
            risk_level: 0.1,
            created_at: new Date().toISOString()
        },
        { 
            id: "t3", 
            name: "Generate cognitive report", 
            description: "Finalize document based on synthesised insights.",
            status: "queued", 
            priority: 40, 
            dependencies: ["t2"], 
            allocated_agent: null,
            estimated_difficulty: 4,
            expected_value: 60,
            risk_level: 0.05,
            created_at: new Date().toISOString()
        }
    ],
    agents: [
        { id: "agent_1", role: "researcher", status: "busy", assigned_task: "t1" },
        { id: "agent_2", role: "analyst", status: "idle", assigned_task: null },
        { id: "agent_3", role: "planner", status: "idle", assigned_task: null }
    ]
};

let memState = { ...defaultState };

export class ExecutiveFunction {
    static async getState() {
        return memState;
    }

    static async getTasks() {
        return memState.tasks;
    }

    static async submitTask(task: any) {
        const newTask = {
            id: "t_" + Math.random().toString(36).substring(7),
            name: task.name || task.title,
            description: task.description || "",
            status: "queued",
            priority: task.priority || Math.floor(Math.random() * 50) + 20,
            dependencies: task.dependencies || [],
            allocated_agent: null,
            estimated_difficulty: task.estimated_difficulty || 5,
            expected_value: task.expected_value || 50,
            risk_level: task.risk_level || 0.1,
            created_at: new Date().toISOString()
        };
        memState.tasks.push(newTask);
        memState.tasks.sort((a, b) => b.priority - a.priority);
        this.tryAllocate();
        return newTask;
    }

    static async pauseTask(taskId: string) {
        const task = memState.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = "paused";
            if (task.allocated_agent) {
                const agent = memState.agents.find(a => a.id === task.allocated_agent);
                if (agent) {
                    agent.status = "idle";
                    agent.assigned_task = null;
                }
                task.allocated_agent = null;
            }
            this.tryAllocate();
        }
    }

    static async resumeTask(taskId: string) {
        const task = memState.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = "queued";
            this.tryAllocate();
        }
    }
    
    static async completeTask(taskId: string) {
        const task = memState.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = "completed";
            if (task.allocated_agent) {
                const agent = memState.agents.find(a => a.id === task.allocated_agent);
                if (agent) {
                    agent.status = "idle";
                    agent.assigned_task = null;
                }
                task.allocated_agent = null;
            }
            this.tryAllocate();
        }
    }

    static tryAllocate() {
        for (const task of memState.tasks) {
            if (task.status === "queued") {
                let ready = true;
                if (task.dependencies) {
                    for (const dep of task.dependencies) {
                        const dTask = memState.tasks.find(t => t.id === dep);
                        if (dTask && dTask.status !== "completed") {
                            ready = false; break;
                        }
                    }
                }
                if (ready) {
                    const agent = memState.agents.find(a => a.status === "idle");
                    if (agent) {
                        agent.status = "busy";
                        agent.assigned_task = task.id;
                        task.status = "running";
                        task.allocated_agent = agent.id;
                    }
                }
            }
        }
    }
}
