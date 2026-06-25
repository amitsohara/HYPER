import { PersistentBrainDB, MemoryDB } from './db.js';
import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export class PersistentBrain {
  static async getDB(): Promise<MemoryDB> {
    return await PersistentBrainDB.load();
  }

  static async saveDB(db: MemoryDB) {
    await PersistentBrainDB.save(db);
  }

  static async storeEpisodicMemory(memory: any) {
    const db = await this.getDB();
    db.episodic.push({ ...memory, id: Math.random().toString(36).substring(7), timestamp: new Date().toISOString(), type: 'episodic', importance: 1.0 });
    await this.saveDB(db);
  }

  static async storeSemanticMemory(concept: string, fact: string) {
    const db = await this.getDB();
    db.semantic.push({ id: Math.random().toString(36).substring(7), concept, fact, timestamp: new Date().toISOString(), importance: 1.0 });
    await this.saveDB(db);
  }

  static async storeProceduralMemory(pattern: any) {
    const db = await this.getDB();
    db.procedural.push({ id: Math.random().toString(36).substring(7), ...pattern, timestamp: new Date().toISOString(), importance: 1.0 });
    await this.saveDB(db);
  }

  static async updateConceptNode(concept: string, related: string[]) {
    const db = await this.getDB();
    let node = db.concepts.find(c => c.name === concept);
    if (!node) {
      node = { name: concept, connections: [], strength: 1.0 };
      db.concepts.push(node);
    } else {
      node.strength += 0.1;
    }
    for (const rel of related) {
      if (!node.connections.includes(rel)) {
        node.connections.push(rel);
      }
    }
    await this.saveDB(db);
  }

  static async reconstructContext(ai: GoogleGenAI, mission: string): Promise<string> {
    const db = await this.getDB();
    
    // Simple semantic search approximation
    const prompt = `Given the mission: "${mission}", extract the top 3 core concepts/keywords as a JSON array of strings. Format: ["concept1", "concept2"]`;
    let concepts: string[] = [];
    try {
        const res = await generateWithRetry(ai, {
           model: 'gemini-3.1-flash-lite',
           contents: prompt,
           config: { responseMimeType: "application/json" }
        }, 3);
        concepts = await cleanJSON(res?.text || "[]", ai) || [];
    } catch(e) {}
    
    const relevantEpisodic = db.episodic.filter(m => concepts.some(c => JSON.stringify(m).toLowerCase().includes(c.toLowerCase()))).slice(-3);
    const relevantSemantic = db.semantic.filter(m => concepts.some(c => m.concept.toLowerCase().includes(c.toLowerCase()) || m.fact.toLowerCase().includes(c.toLowerCase()))).slice(-5);
    const relevantBeliefs = db.beliefs.filter(b => concepts.some(c => b.belief.toLowerCase().includes(c.toLowerCase())));

    return JSON.stringify({
      relevant_history: relevantEpisodic,
      facts: relevantSemantic,
      active_beliefs: relevantBeliefs
    });
  }

  static async updateBeliefs(ai: GoogleGenAI, missionData: any) {
    const db = await this.getDB();
    const prompt = `You are the Belief Engine. Review the latest mission data: ${JSON.stringify(missionData)}
Current Beliefs: ${JSON.stringify(db.beliefs)}
Identify if any existing beliefs should be updated (confidence changed, evidence added) OR if new beliefs should be formed.
Return a JSON object:
{
  "new_beliefs": [
    { "belief": "Statement", "confidence": 0.8, "supporting_evidence": ["..."], "contradicting_evidence": ["..."] }
  ],
  "updated_beliefs": [
    { "id": "existing_id", "belief": "Updated Statement", "confidence": 0.9, "supporting_evidence": ["..."], "contradicting_evidence": ["..."] }
  ]
}`;
    try {
        const res = await generateWithRetry(ai, {
           model: 'gemini-3.1-flash-lite',
           contents: prompt,
           config: { responseMimeType: "application/json" }
        }, 3);
        const updates = await cleanJSON(res?.text || "{}", ai);
        
        if (updates.new_beliefs) {
           for (const nb of updates.new_beliefs) {
               db.beliefs.push({
                   id: Math.random().toString(36).substring(7),
                   ...nb,
                   last_updated: new Date().toISOString(),
                   version: 1
               });
           }
        }
        if (updates.updated_beliefs) {
           for (const ub of updates.updated_beliefs) {
               const idx = db.beliefs.findIndex(b => b.id === ub.id);
               if (idx !== -1) {
                   db.beliefs[idx] = {
                       ...db.beliefs[idx],
                       ...ub,
                       version: (db.beliefs[idx].version || 1) + 1,
                       last_updated: new Date().toISOString()
                   };
               }
           }
        }
        await this.saveDB(db);
    } catch(e) { console.error("Belief update failed", e); }
  }

  static async consolidateMemory(ai: GoogleGenAI) {
      const db = await this.getDB();
      // Decay importance of old episodic memories
      const now = Date.now();
      db.episodic.forEach(e => {
          const ageDays = (now - new Date(e.timestamp).getTime()) / (1000 * 60 * 60 * 24);
          if (ageDays > 7) e.importance *= 0.9;
      });
      // Sort and keep top important ones, or just let them stay with low importance
      await this.saveDB(db);
  }

  static async processMissionComplete(ai: GoogleGenAI, reportFull: any) {
      await this.storeEpisodicMemory({ mission_id: reportFull.id, mission_text: reportFull.mission_text, summary: reportFull.finalReportData?.executive_summary });
      
      // Extract semantics & concepts
      try {
          const prompt = `Extract core semantic facts and concepts from this mission report: ${JSON.stringify(reportFull.finalReportData?.key_findings || {})}
Return JSON:
{
  "facts": [{ "concept": "Topic", "fact": "Detailed fact" }],
  "concepts": [{ "name": "Topic", "related": ["Other", "Topics"] }]
}`;
          const res = await generateWithRetry(ai, {
             model: 'gemini-3.1-flash-lite',
             contents: prompt,
             config: { responseMimeType: "application/json" }
          }, 3);
          const data = await cleanJSON(res?.text || "{}", ai);
          
          if (data.facts) {
              for (const f of data.facts) {
                  await this.storeSemanticMemory(f.concept, f.fact);
              }
          }
          if (data.concepts) {
              for (const c of data.concepts) {
                  await this.updateConceptNode(c.name, c.related);
              }
          }
      } catch(e) {}

      await this.updateBeliefs(ai, reportFull);
      await this.consolidateMemory(ai);
  }
}
