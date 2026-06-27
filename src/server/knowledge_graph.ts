import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from './engines.js';

export interface KGNode {
    id: string;
    labels: string[];
}

export interface KGEdge {
    source: string;
    target: string;
    type: string;
}

export class KnowledgeGraph {
    nodes: Map<string, KGNode> = new Map();
    edges: KGEdge[] = [];

    // Extract and update the graph
    async update(ai: GoogleGenAI, missionData: any): Promise<void> {
        if (missionData.social_cognition?.relationship_graph?.nodes) {
            for (const n of missionData.social_cognition.relationship_graph.nodes) {
                if (!this.nodes.has(n.id)) {
                    this.nodes.set(n.id, n);
                } else {
                    const existing = this.nodes.get(n.id)!;
                    existing.labels = Array.from(new Set([...existing.labels, ...(n.labels || [])]));
                    this.nodes.set(n.id, existing);
                }
            }
        }
        if (missionData.social_cognition?.relationship_graph?.edges) {
            for (const e of missionData.social_cognition.relationship_graph.edges) {
                const isDup = this.edges.find(ex => ex.source === e.source && ex.target === e.target && ex.type === e.type);
                if (!isDup) {
                    this.edges.push(e);
                }
            }
        }

        const prompt = `You are the EntityExtractor and RelationshipBuilder. Extract knowledge graph nodes and edges from this mission data.
Mission: ${missionData.mission_text}
Goals: ${JSON.stringify(missionData.goals)}
Discoveries: ${JSON.stringify(missionData.scientific_discovery?.ideas || {})}
Social Nodes: ${JSON.stringify(missionData.social_cognition?.relationship_graph?.nodes || [])}

Return EXACTLY a JSON object with:
{
  "nodes": [
     { "id": "ConceptName", "labels": ["Concept", "Technology", "Location"] }
  ],
  "edges": [
     { "source": "ConceptName1", "target": "ConceptName2", "type": "RELATES_TO" }
  ]
}`;
        try {
            const resp = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(resp?.text || "{}", ai);
            
            if (data?.nodes) {
                for (const n of data.nodes) {
                    if (!this.nodes.has(n.id)) {
                        this.nodes.set(n.id, n);
                    } else {
                        const existing = this.nodes.get(n.id)!;
                        existing.labels = Array.from(new Set([...existing.labels, ...(n.labels || [])]));
                        this.nodes.set(n.id, existing);
                    }
                }
            }
            if (data?.edges) {
                for (const e of data.edges) {
                    // Prevent exact duplicates
                    const isDup = this.edges.find(ex => ex.source === e.source && ex.target === e.target && ex.type === e.type);
                    if (!isDup) {
                        this.edges.push(e);
                    }
                }
            }
        } catch(e) {
            console.warn("Knowledge Graph update error:", e);
        }
    }

    async search(ai: GoogleGenAI, query: string): Promise<any> {
        if (this.nodes.size === 0) return { related_concepts: [], connected_discoveries: [], insights: "Knowledge Graph empty. Initializing new cognitive lattice..." };

        const allNodes = Array.from(this.nodes.values()).map(n => n.id);
        
        const prompt = `Based on the user's mission "${query}", identify up to 10 relevant concepts from our database: ${JSON.stringify(allNodes)}.
Return a JSON object:
{
  "relevant_node_ids": ["id1", "id2"]
}`;
        try {
            const resp = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            }, 3);
            const data = await cleanJSON(resp?.text || "{}", ai);
            const initialNodes = data?.relevant_node_ids || [];
            
            const relatedEdges = this.edges.filter(e => initialNodes.includes(e.source) || initialNodes.includes(e.target));
            const relatedNodes = new Set<string>([...initialNodes]);
            relatedEdges.forEach(e => {
                relatedNodes.add(e.source);
                relatedNodes.add(e.target);
            });

            const prompt2 = `Synthesize an insight based on these connected graph entities relevant to the mission "${query}":
Nodes: ${Array.from(relatedNodes).join(", ")}
Edges: ${JSON.stringify(relatedEdges)}

Return EXACTLY a JSON object with:
{
  "related_concepts": ["concept 1", "concept 2"],
  "connected_discoveries": ["discovery 1", "discovery 2"],
  "insights": "Detailed graph synthesis insight linking these elements to the query."
}`;
            const resp2 = await generateWithRetry(ai, {
                model: 'gemini-1.5-flash',
                contents: prompt2,
                config: { responseMimeType: "application/json" }
            }, 3);
            return await cleanJSON(resp2?.text || "{}", ai) || { related_concepts: [], connected_discoveries: [], insights: "Unable to generate insights." };
        } catch(e) {
            console.error("KG Search Error", e);
            return { related_concepts: [], connected_discoveries: [], insights: "Graph synchronization error." };
        }
    }

    exportGraph() {
        return {
            nodes: Array.from(this.nodes.values()),
            edges: this.edges
        };
    }
}

export const kgInstance = new KnowledgeGraph();
