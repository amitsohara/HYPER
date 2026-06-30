import { KnowledgeArtifact, EvolutionLesson } from "./memoryTypes.js";
import { MemoryEventBus, MemoryEvents } from "./memoryEvents.js";
import { MemoryMetrics } from "./memoryMetrics.js";

export class InstitutionalKnowledgeBase {
    private eventBus = MemoryEventBus.getInstance();
    private artifacts: Map<string, KnowledgeArtifact> = new Map();
    private lessons: Map<string, EvolutionLesson> = new Map();

    public addArtifact(artifact: KnowledgeArtifact) {
        this.artifacts.set(artifact.artifact_id, artifact);
        MemoryMetrics.knowledge_artifacts_created++;
        this.eventBus.publish(MemoryEvents.INSTITUTIONAL_KNOWLEDGE_UPDATED, { type: 'ARTIFACT', item: artifact });
    }

    public addLesson(lesson: EvolutionLesson) {
        this.lessons.set(lesson.lesson_id, lesson);
        MemoryMetrics.lessons_learned++;
        this.eventBus.publish(MemoryEvents.LESSON_LEARNED, lesson);
    }

    public getAllArtifacts(): KnowledgeArtifact[] {
        return Array.from(this.artifacts.values());
    }

    public getAllLessons(): EvolutionLesson[] {
        return Array.from(this.lessons.values());
    }
}
