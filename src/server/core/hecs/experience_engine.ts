import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../../engines.js";
import { Experience } from './experience_types.js';
import { ExperienceStore } from './experience_store.js';
import { ExperienceValidator } from './experience_validator.js';
import { ExperienceGraph } from './experience_graph.js';
import { ExperienceMetricsTracker } from './experience_metrics.js';
import { ReflectionEngine } from './reflection_engine.js';
import { ExperienceQualityScorer } from './experience_quality_scorer.js';
import { LessonExtractor } from './lesson_extractor.js';
import { MistakeDetector } from './mistake_detector.js';
import { PatternExtractor } from './pattern_extractor.js';

export class ExperienceEngine {
    static async generateExperience(ai: GoogleGenAI, finalState: any): Promise<Experience | null> {
        
        const missionId = `mission_${Date.now()}`;
        const experienceId = `exp_${Date.now()}`;
        
        const prompt = `You are the HyperMind Experience Engine (HECS).
Your job is to convert a completed mission into a permanent cognitive experience.
Analyze the following mission execution state and extract transferable knowledge.

Mission: ${finalState.mission || 'Unknown'}
Domain: ${finalState.mission_type || finalState.understanding?.mission_type || 'General'}
Outcome/Report: ${JSON.stringify(finalState.report || finalState.decision || {})}
Learning: ${JSON.stringify(finalState.learning_summary || {})}

Return a valid JSON object matching this structure:
{
    "mission_domain": "string (Specific domain)",
    "mission_type": "string",
    "mission_complexity": 5, // 1-10
    "reasoning_summary": "string",
    "imagined_world_summary": "string",
    "decision_summary": "string",
    "action_summary": "string",
    "predicted_outcome": "string",
    "actual_outcome": "string",
    "prediction_error": 0.5, // 0.0-1.0
    "confidence": 85, // 0-100
    "uncertainty": 15, // 0-100
    "success_score": 90, // 0-100
    "usefulness_score": 80, // 0-100
    "novelty_score": 75, // 0-100
    "domain_tags": ["tag1", "tag2"],
    "transferable_skills": ["skill 1"]
}
`;

        try {
            const response = await generateWithRetry(ai, {
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            
            let parsed = await cleanJSON(response?.text || "{}", ai);
            
            // dev_stub fallback
            if (process.env.MODEL_MODE === 'dev_stub' && (!parsed.mission_domain)) {
                 parsed = {
                     mission_domain: finalState.mission_type || "Test Domain",
                     mission_type: "Test",
                     mission_complexity: 5,
                     reasoning_summary: "Test reasoning",
                     decision_summary: "Test decision",
                     confidence: 90,
                     success_score: 90,
                     quality_score: 90,
                     transferable_skills: ["Test skill"]
                 };
            }
            
            if (!parsed.mission_domain) return null;

            // 1. Run ReflectionEngine
            const reflection = await ReflectionEngine.reflect(ai, finalState);

            // 2. Run QualityScorer
            const qualityData = await ExperienceQualityScorer.score(ai, finalState, reflection);

            // 3. Run LessonExtractor
            const lessons = await LessonExtractor.extract(ai, finalState, reflection);

            // 4. Run MistakeDetector
            const mistakes = await MistakeDetector.detect(ai, finalState, reflection);

            // 5. Run PatternExtractor
            const patterns = await PatternExtractor.extract(ai, finalState, reflection, lessons, mistakes);

            const exp: Experience = {
                experience_id: experienceId,
                mission_id: missionId,
                mission: finalState.mission || 'Unknown',
                mission_domain: parsed.mission_domain || 'General',
                mission_type: finalState.mission_type || parsed.mission_type || 'General',
                mission_complexity: parsed.mission_complexity || 5,
                timestamp: Date.now(),
                context: {},
                modules_used: finalState.completed_modules || [],
                reasoning_summary: parsed.reasoning_summary || '',
                imagined_world_summary: parsed.imagined_world_summary || '',
                evidence_summary: finalState.evidence || [],
                decision_summary: parsed.decision_summary || '',
                action_summary: parsed.action_summary || '',
                predicted_outcome: parsed.predicted_outcome || '',
                actual_outcome: parsed.actual_outcome || '',
                prediction_error: parsed.prediction_error || 0,
                confidence: parsed.confidence || 80,
                uncertainty: parsed.uncertainty || 20,
                success_score: parsed.success_score || 85,
                usefulness_score: parsed.usefulness_score || 80,
                novelty_score: parsed.novelty_score || 50,
                quality_score: qualityData.quality_score,
                reflection_result: reflection,
                domain_tags: parsed.domain_tags || [],
                lessons: lessons.lessons_learned || [],
                mistakes: mistakes.detected_mistakes || [],
                strengths: reflection.what_worked || [],
                weaknesses: reflection.what_failed || [],
                reusable_patterns: patterns.reusable_patterns || [],
                transferable_skills: parsed.transferable_skills || [],
                related_experiences: []
            };

            const validation = ExperienceValidator.validate(exp, finalState.status, finalState.report);
            if (validation.valid) {
                ExperienceStore.storeExperience(exp);
                ExperienceGraph.buildGraph();
                const { CompetenceTracker } = await import('./competence_tracker.js');
                CompetenceTracker.updateFromExperience(exp);
                
                // HECS Part 4: Extract skills and strategies
                const { SkillExtractor } = await import('./skill_extractor.js');
                const { StrategyValidator } = await import('./strategy_validator.js');
                const { SkillEvolutionEngine } = await import('./skill_evolution_engine.js');
                
                const { skills, strategies } = await SkillExtractor.extract(ai, exp);
                
                const validSkills = skills.filter(s => StrategyValidator.validateSkill(s));
                const validStrategies = strategies.filter(s => StrategyValidator.validateStrategy(s));
                
                SkillEvolutionEngine.evolveSkills(validSkills);
                SkillEvolutionEngine.evolveStrategies(validStrategies);

                return exp;
            } else {
                console.log(`[HECS] Experience rejected: ${validation.reason}`);
                return null;
            }
        } catch (e) {
            console.error("[HECS] Failed to generate experience", e);
            return null;
        }
    }
}
