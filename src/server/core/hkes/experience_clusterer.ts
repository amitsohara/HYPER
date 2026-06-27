import { Experience } from '../hecs/experience_types.js';

export interface ExperienceCluster {
    cluster_id: string;
    cluster_name: string;
    domain: string;
    mission_types: string[];
    experience_ids: string[];
    experiences: Experience[];
    similarity_score: number;
    reason: string;
}

export class ExperienceClusterer {
    static clusterExperiences(experiences: Experience[]): ExperienceCluster[] {
        // Basic implementation: group by domain and mission_type if they share some patterns/lessons
        const clusters: Map<string, ExperienceCluster> = new Map();

        experiences.forEach(exp => {
            const domain = exp.mission_domain.toLowerCase();
            const key = domain; // For simplicity, cluster by domain first

            if (!clusters.has(key)) {
                clusters.set(key, {
                    cluster_id: `cluster_${key}_${Date.now()}`,
                    cluster_name: `${exp.mission_domain} Cluster`,
                    domain: exp.mission_domain,
                    mission_types: [],
                    experience_ids: [],
                    experiences: [],
                    similarity_score: 85,
                    reason: `Shared domain: ${exp.mission_domain}`
                });
            }

            const cluster = clusters.get(key)!;
            cluster.experience_ids.push(exp.experience_id);
            cluster.experiences.push(exp);
            if (!cluster.mission_types.includes(exp.mission_type)) {
                cluster.mission_types.push(exp.mission_type);
            }
        });

        // Only return clusters with >= 3 experiences
        return Array.from(clusters.values()).filter(c => c.experience_ids.length >= 3);
    }
}
