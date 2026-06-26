-- HyperMind-X PostgreSQL Schema
-- Phase 13-15: Cognitive Architecture, Executive Function, and Autonomous Learning

CREATE TABLE cognitive_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id VARCHAR(255),
    uncertainty_level FLOAT DEFAULT 0.0,
    confidence_level FLOAT DEFAULT 1.0,
    reasoning_summary TEXT,
    knowledge_gaps JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE beliefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    belief_text TEXT NOT NULL,
    confidence_score FLOAT NOT NULL,
    evidence JSONB DEFAULT '[]',
    contradicting_evidence JSONB DEFAULT '[]',
    version INT DEFAULT 1,
    source_missions JSONB DEFAULT '[]',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id VARCHAR(255),
    primary_goal TEXT NOT NULL,
    subgoals JSONB DEFAULT '[]',
    hidden_assumptions JSONB DEFAULT '[]',
    missing_knowledge JSONB DEFAULT '[]',
    risk_factors JSONB DEFAULT '[]',
    success_criteria JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    short_term_steps JSONB DEFAULT '[]',
    medium_term_steps JSONB DEFAULT '[]',
    long_term_steps JSONB DEFAULT '[]',
    required_agents JSONB DEFAULT '[]',
    required_tools JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]',
    failure_points JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority INT DEFAULT 50,
    status VARCHAR(50) DEFAULT 'pending',
    dependency_ids JSONB DEFAULT '[]',
    assigned_agent VARCHAR(100),
    estimated_difficulty INT,
    expected_value INT,
    risk_level FLOAT,
    deadline_optional TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(255) NOT NULL,
    skill_description TEXT,
    domain VARCHAR(100),
    use_case TEXT,
    procedure JSONB DEFAULT '[]',
    success_rate FLOAT DEFAULT 0.5,
    evidence TEXT,
    related_missions JSONB DEFAULT '[]',
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id VARCHAR(255) NOT NULL,
    reasoning_quality INT,
    novelty INT,
    usefulness INT,
    factual_confidence INT,
    planning_quality INT,
    risk_awareness INT,
    learning_value INT,
    justification TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experience_replays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id VARCHAR(255) NOT NULL,
    old_score INT,
    new_score INT,
    intelligence_gain INT,
    insights_gained JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note:
-- Neo4j graphs would be constructed by creating (Belief)-[:CONTRADICTS]->(Belief), (Goal)-[:DEPENDS_ON]->(Goal)
-- Qdrant vectors would index belief_text, skill_description, and mission_text for semantic retrieval.

-- Phase 26: Benchmarking and Intelligence Evaluation

CREATE TABLE benchmark_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(255) NOT NULL,
    mission_id VARCHAR(255),
    overall_score FLOAT NOT NULL,
    reasoning_score FLOAT,
    planning_score FLOAT,
    memory_score FLOAT,
    learning_score FLOAT,
    research_score FLOAT,
    simulation_score FLOAT,
    creativity_score FLOAT,
    causal_score FLOAT,
    meta_cognition_score FLOAT,
    tool_use_score FLOAT,
    theory_of_mind_score FLOAT,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES benchmark_runs(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value FLOAT NOT NULL,
    expected_value FLOAT,
    deviation FLOAT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE capability_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version VARCHAR(255) NOT NULL,
    capability_name VARCHAR(100) NOT NULL,
    score FLOAT NOT NULL,
    regression_detected BOOLEAN DEFAULT FALSE,
    change_from_previous FLOAT DEFAULT 0.0,
    run_id UUID REFERENCES benchmark_runs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE benchmark_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    mission_text TEXT NOT NULL,
    expected_capabilities TEXT NOT NULL,
    evaluation_rubric TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
