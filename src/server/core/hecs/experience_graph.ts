import { Experience } from './experience_types.js';
import { ExperienceStore } from './experience_store.js';

export interface GraphNode {
    id: string;
    type: 'Experience' | 'Mission' | 'Skill' | 'Strategy' | 'Concept' | 'Evidence' | 'Decision' | 'Domain';
    label: string;
}

export interface GraphEdge {
    source: string;
    target: string;
    relation: 'similar_to' | 'depends_on' | 'improved_by' | 'contradicts' | 'reuses' | 'extends' | 'caused' | 'learned_from';
}

export class ExperienceGraph {
    private static nodes: Map<string, GraphNode> = new Map();
    private static edges: GraphEdge[] = [];

    static buildGraph() {
        this.nodes.clear();
        this.edges = [];

        const experiences = ExperienceStore.getAll();
        
        experiences.forEach(e => {
            // Add Experience node
            this.addNode(e.experience_id, 'Experience', `Exp: ${e.mission.substring(0, 20)}`);
            
            // Add Mission node
            this.addNode(e.mission_id, 'Mission', e.mission);
            this.addEdge(e.experience_id, e.mission_id, 'caused');

            // Add Domain node
            this.addNode(`domain_${e.mission_domain}`, 'Domain', e.mission_domain);
            this.addEdge(e.experience_id, `domain_${e.mission_domain}`, 'extends');

            // Add Skill nodes
            e.transferable_skills.forEach(skill => {
                const skillId = `skill_${skill.toLowerCase().replace(/\s+/g, '_')}`;
                this.addNode(skillId, 'Skill', skill);
                this.addEdge(e.experience_id, skillId, 'learned_from');
            });
            
            // Add related links
            e.related_experiences.forEach(rel => {
                if (ExperienceStore.retrieveExperience(rel)) {
                    this.addEdge(e.experience_id, rel, 'similar_to');
                }
            });
        });
    }

    static addNode(id: string, type: GraphNode['type'], label: string) {
        if (!this.nodes.has(id)) {
            this.nodes.set(id, { id, type, label });
        }
    }

    static addEdge(source: string, target: string, relation: GraphEdge['relation']) {
        if (!this.edges.some(e => e.source === source && e.target === target && e.relation === relation)) {
            this.edges.push({ source, target, relation });
        }
    }
    
    static getGraph() {
        return {
            nodes: Array.from(this.nodes.values()),
            edges: this.edges
        };
    }
}
