import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import { generateWithRetry, cleanJSON } from '../engines.js';

export class PersistentBrain {
  static async storeEpisodicMemory(memory: any) {
    if (!db) return;
    try {
      await addDoc(collection(db, 'episodic_memories'), {
        ...memory,
        timestamp: new Date().toISOString(),
        type: 'episodic',
        importance: 1.0
      });
    } catch (e) {
      console.warn('Error storing episodic memory:', e);
    }
  }

  static async storeSemanticMemory(concept: string, fact: string) {
    if (!db) return;
    try {
      await addDoc(collection(db, 'semantic_memories'), {
        concept,
        fact,
        timestamp: new Date().toISOString(),
        importance: 1.0
      });
    } catch (e) {
      console.error('Error storing semantic memory:', e);
    }
  }

  static async storeProceduralMemory(pattern: any) {
    if (!db) return;
    try {
      await addDoc(collection(db, 'procedural_memories'), {
        ...pattern,
        timestamp: new Date().toISOString(),
        importance: 1.0
      });
    } catch (e) {
      console.error('Error storing procedural memory:', e);
    }
  }

  static async updateConceptNode(concept: string, related: string[]) {
    if (!db) return;
    try {
      const docRef = doc(db, 'concepts', concept);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const connections = new Set([...(data.connections || []), ...related]);
        await updateDoc(docRef, {
          strength: (data.strength || 1.0) + 0.1,
          connections: Array.from(connections)
        });
      } else {
        await setDoc(docRef, {
          name: concept,
          connections: related,
          strength: 1.0
        });
      }
    } catch (e) {
      console.error('Error updating concept node:', e);
    }
  }

  static async reconstructContext(ai: GoogleGenAI, mission: string): Promise<string> {
    if (!db) return "{}";
    
    // Simple semantic search approximation
    const prompt = `Given the mission: "${mission}", extract the top 3 core concepts/keywords as a JSON array of strings. Format: ["concept1", "concept2"]`;
    let concepts: string[] = [];
    try {
        const res = await generateWithRetry(ai, {
           model: 'gemini-flash-latest',
           contents: prompt,
           config: { responseMimeType: "application/json" }
        }, 3);
        concepts = await cleanJSON(res?.text || "[]", ai) || [];
    } catch(e) {}
    
    try {
      // Fetch recent episodic memories
      const episodicQ = query(collection(db, 'episodic_memories'), orderBy('timestamp', 'desc'), limit(10));
      const episodicSnap = await getDocs(episodicQ);
      const allEpisodic = episodicSnap.docs.map(d => d.data());
      const relevantEpisodic = allEpisodic.filter(m => concepts.some(c => JSON.stringify(m).toLowerCase().includes(c.toLowerCase()))).slice(-3);

      // Fetch recent semantic memories
      const semanticQ = query(collection(db, 'semantic_memories'), orderBy('timestamp', 'desc'), limit(20));
      const semanticSnap = await getDocs(semanticQ);
      const allSemantic = semanticSnap.docs.map(d => d.data());
      const relevantSemantic = allSemantic.filter(m => concepts.some(c => m.concept.toLowerCase().includes(c.toLowerCase()) || m.fact.toLowerCase().includes(c.toLowerCase()))).slice(-5);

      // Fetch beliefs
      const beliefsQ = query(collection(db, 'beliefs'), orderBy('last_updated', 'desc'), limit(20));
      const beliefsSnap = await getDocs(beliefsQ);
      const allBeliefs = beliefsSnap.docs.map(d => d.data());
      const relevantBeliefs = allBeliefs.filter(b => concepts.some(c => (b.belief || "").toLowerCase().includes(c.toLowerCase())));

      return JSON.stringify({
        relevant_history: relevantEpisodic,
        facts: relevantSemantic,
        active_beliefs: relevantBeliefs
      });
    } catch (e) {
      console.error('Error reconstructing context:', e);
      return "{}";
    }
  }

  static async updateBeliefs(ai: GoogleGenAI, missionData: any) {
    if (!db) return;
    try {
      const beliefsSnap = await getDocs(collection(db, 'beliefs'));
      const currentBeliefs = beliefsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const prompt = `You are the Belief Engine. Review the latest mission data: ${JSON.stringify(missionData)}
Current Beliefs: ${JSON.stringify(currentBeliefs)}
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
      const res = await generateWithRetry(ai, {
         model: 'gemini-flash-latest',
         contents: prompt,
         config: { responseMimeType: "application/json" }
      }, 3);
      const updates = await cleanJSON(res?.text || "{}", ai);
      
      if (updates.new_beliefs) {
         for (const nb of updates.new_beliefs) {
            await addDoc(collection(db, 'beliefs'), {
              ...nb,
              last_updated: new Date().toISOString(),
              version: 1
            });
         }
      }
      if (updates.updated_beliefs) {
         for (const ub of updates.updated_beliefs) {
            const docRef = doc(db, 'beliefs', ub.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              await updateDoc(docRef, {
                ...ub,
                version: (docSnap.data().version || 1) + 1,
                last_updated: new Date().toISOString()
              });
            }
         }
      }
    } catch(e) { console.error("Belief update failed", e); }
  }

  static async consolidateMemory(ai: GoogleGenAI) {
      // Stub for memory consolidation if needed
  }

  static async processMissionComplete(ai: GoogleGenAI, reportFull: any) {
      await this.storeEpisodicMemory({ mission_id: reportFull.id, mission_text: reportFull.mission_text, summary: reportFull.finalReportData?.executive_summary });
      
      try {
          const prompt = `Extract core semantic facts and concepts from this mission report: ${JSON.stringify(reportFull.finalReportData?.key_findings || {})}
Return JSON:
{
  "facts": [{ "concept": "Topic", "fact": "Detailed fact" }],
  "concepts": [{ "name": "Topic", "related": ["Other", "Topics"] }]
}`;
          const res = await generateWithRetry(ai, {
             model: 'gemini-flash-latest',
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
