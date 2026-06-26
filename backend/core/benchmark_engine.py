import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

class PostgresDB:
    def __init__(self):
        self.conn_str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
        
    def get_connection(self):
        return psycopg2.connect(self.conn_str)
        
    def initialize_tables(self):
        query = """
        CREATE TABLE IF NOT EXISTS benchmark_runs (
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
        
        CREATE TABLE IF NOT EXISTS performance_metrics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            run_id UUID REFERENCES benchmark_runs(id) ON DELETE CASCADE,
            metric_name VARCHAR(100) NOT NULL,
            metric_value FLOAT NOT NULL,
            expected_value FLOAT,
            deviation FLOAT,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS capability_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            version VARCHAR(255) NOT NULL,
            capability_name VARCHAR(100) NOT NULL,
            score FLOAT NOT NULL,
            regression_detected BOOLEAN DEFAULT FALSE,
            change_from_previous FLOAT DEFAULT 0.0,
            run_id UUID REFERENCES benchmark_runs(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS benchmark_missions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            mission_id VARCHAR(100) UNIQUE NOT NULL,
            category VARCHAR(100) NOT NULL,
            difficulty VARCHAR(50) NOT NULL,
            mission_text TEXT NOT NULL,
            expected_capabilities TEXT NOT NULL,
            evaluation_rubric TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(query)
                conn.commit()
            print("PostgreSQL tables initialized successfully.")
        except Exception as e:
            print(f"Error initializing PostgreSQL tables: {e}")

class BenchmarkEngine:
    def __init__(self, llm_client=None):
        self.db = PostgresDB()
        self.llm_client = llm_client
        self.db.initialize_tables()

    def evaluate_output(self, mission, output):
        # Simplified scoring logic simulating LLM evaluation against rubric
        score = 85 # Mocked LLM evaluation score
        return score

    def run_suite(self, version_name):
        print(f"Running automated HXBS evaluation for {version_name}...")
        
        # Simplified scoring for required categories
        scores = {
            "reasoning_score": self.evaluate_output("reasoning", "output"),
            "planning_score": self.evaluate_output("planning", "output"),
            "memory_score": self.evaluate_output("memory", "output"),
            "learning_score": 80,
            "research_score": 82,
            "simulation_score": 88,
            "creativity_score": 90,
            "causal_score": 84,
            "meta_cognition_score": 79,
            "tool_use_score": 95,
            "theory_of_mind_score": 76
        }
        
        overall = sum(scores.values()) // len(scores)
        
        try:
            with self.db.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO benchmark_runs (
                            version, overall_score, reasoning_score, planning_score, memory_score,
                            learning_score, research_score, simulation_score, creativity_score,
                            causal_score, meta_cognition_score, tool_use_score, theory_of_mind_score
                        ) VALUES (
                            %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                        )
                    """, (
                        version_name, overall, scores["reasoning_score"], scores["planning_score"],
                        scores["memory_score"], scores["learning_score"], scores["research_score"],
                        scores["simulation_score"], scores["creativity_score"], scores["causal_score"],
                        scores["meta_cognition_score"], scores["tool_use_score"], scores["theory_of_mind_score"]
                    ))
                conn.commit()
            print(f"Benchmark for {version_name} saved to PostgreSQL. Overall: {overall}")
        except Exception as e:
            print(f"Error saving to PostgreSQL: {e}")
            
        return {"version": version_name, "overall": overall, "scores": scores}

# To be integrated with master_mission_orchestrator.py 
# benchmark = BenchmarkEngine()
# benchmark.run_suite("HyperMind-X Latest")
