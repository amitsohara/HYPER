import { Experience, Episode, ValidationStatus } from "../types.js";
import { v4 as uuidv4 } from "uuid";
import { HyperMindEventMesh } from "../../hcns01/eventMesh.js";
import { CognitiveEvent, CognitiveDomain } from "../../hcns01/types.js";

export class ExperienceCollector {
    private experiences: Experience[] = [];

    constructor(private eventMesh: HyperMindEventMesh) {}

    recordExperience(event: CognitiveEvent<any>): Experience {
        const exp: Experience = {
            id: `exp-${uuidv4()}`,
            traceId: `trc-${uuidv4()}`,
            researchId: `res-${uuidv4()}`,
            timestamp: Date.now(),
            eventType: event.type,
            payload: event.payload,
            confidence: 1.0,
            provenance: event.source,
            version: 1,
            telemetry: {},
            lifecycle: "COLLECTED"
        };
        this.experiences.push(exp);
        return exp;
    }

    getExperiences(): Experience[] {
        return this.experiences;
    }
}

export class EpisodeManager {
    private episodes: Map<string, Episode> = new Map();

    createEpisode(missionId: string, experiences: Experience[]): Episode {
        const episode: Episode = {
            id: `ep-${uuidv4()}`,
            traceId: `trc-${uuidv4()}`,
            researchId: `res-${uuidv4()}`,
            missionId,
            context: {},
            goals: [],
            observations: experiences.filter(e => e.eventType === "WORLD_OBSERVATION"),
            plans: experiences.filter(e => e.eventType === "PLAN_EVALUATED"),
            actions: experiences.filter(e => e.eventType === "ACTION_COMPLETED"),
            results: experiences.filter(e => e.eventType === "MISSION_COMPLETED" || e.eventType === "MISSION_FAILED"),
            lessons: [],
            validationStatus: ValidationStatus.CANDIDATE,
            confidence: 1.0,
            timestamp: Date.now(),
            provenance: "HLLE_EPISODE_MANAGER",
            version: 1,
            telemetry: {},
            lifecycle: "CREATED"
        };
        this.episodes.set(episode.id, episode);
        return episode;
    }
}
