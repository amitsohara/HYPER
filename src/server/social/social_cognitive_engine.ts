import { GoogleGenAI } from "@google/genai";
import { generateWithRetry, cleanJSON } from "../engines.js";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export class SocialCognitiveEngine {
  static async analyzeSocialContext(ai: GoogleGenAI, missionContext: string): Promise<any> {
     const [
        emotions,
        trust,
        motivation,
        conflicts,
        leadership,
        communication,
        stress,
        relationshipGraph
     ] = await Promise.all([
        this.detectEmotions(ai, missionContext),
        this.estimateTrust(ai, missionContext),
        this.analyzeMotivation(ai, missionContext),
        this.predictConflicts(ai, missionContext),
        this.recommendLeadership(ai, missionContext),
        this.adaptCommunication(ai, missionContext),
        this.predictStress(ai, missionContext),
        this.extractRelationshipGraph(ai, missionContext)
     ]);
     
     const socialCognition = {
        detected_emotions: emotions,
        emotional_context: "Inferred from mission dynamics",
        trust_model: trust,
        motivation_model: motivation,
        stakeholders: relationshipGraph.nodes || [],
        relationship_graph: relationshipGraph,
        conflicts: conflicts,
        negotiation_strategy: "Based on conflicts and trust",
        leadership_strategy: leadership,
        communication_style: communication,
        stress_prediction: stress,
        confidence: 0.85
     };

     await this.storeSocialMemory({
         missionContext,
         ...socialCognition,
         timestamp: new Date().toISOString()
     });

     return socialCognition;
  }

  static async detectEmotions(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Emotion Detector. Detect probable emotional states from this mission context.
Mission Context: ${missionContext}
The system DOES NOT experience emotions. It models human emotional states.
Return a JSON array of objects: [{ "emotion": "confidence", "confidence_score": 0.8, "evidence": "text...", "uncertainty": "may change if..." }]`;
      return await this.generateJSON(ai, prompt, []);
  }

  static async estimateTrust(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Trust Model. Estimate trust relationships based on the context.
Mission Context: ${missionContext}
Return a JSON array of objects: [{ "relationship": "Founder ↔ Investor", "trust_score": 0.7, "trust_risk": "low", "confidence": 0.8, "reasons": "text..." }]`;
      return await this.generateJSON(ai, prompt, []);
  }

  static async analyzeMotivation(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Motivation Analyzer. Estimate motivations of stakeholders.
Mission Context: ${missionContext}
Return a JSON array of objects: [{ "stakeholder": "Team", "motivation": "innovation", "confidence": 0.9, "evidence": "text..." }]`;
      return await this.generateJSON(ai, prompt, []);
  }

  static async predictConflicts(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Conflict Predictor. Predict likely conflicts.
Mission Context: ${missionContext}
Return a JSON array of objects: [{ "conflict_type": "budget conflict", "probability": 0.6, "impact": "high", "mitigation": "text..." }]`;
      return await this.generateJSON(ai, prompt, []);
  }

  static async recommendLeadership(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Leadership Engine. Recommend leadership styles based on the context.
Mission Context: ${missionContext}
Return a JSON object: { "recommended_style": "Transformational", "context": "startup", "reasoning": "text..." }`;
      return await this.generateJSON(ai, prompt, {});
  }

  static async adaptCommunication(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Communication Adapter. Recommend communication styles for different audiences.
Mission Context: ${missionContext}
Return a JSON array of objects: [{ "audience": "Engineer", "style": "technical and direct", "focus": "details" }]`;
      return await this.generateJSON(ai, prompt, []);
  }

  static async predictStress(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Stress Predictor. Estimate operational stress.
Mission Context: ${missionContext}
Return a JSON object: { "overall_stress_level": "medium", "stress_factors": [{ "factor": "team overload", "severity": "high", "mitigation": "text..." }] }`;
      return await this.generateJSON(ai, prompt, {});
  }

  static async extractRelationshipGraph(ai: GoogleGenAI, missionContext: string): Promise<any> {
      const prompt = `You are the Relationship Graph Extractor. Extract social nodes and edges.
Mission Context: ${missionContext}
Nodes can be: Person, Organization, Team, Stakeholder, Customer, Investor, Employee.
Edges can be: trusts, supports, competes, reports_to, depends_on, conflicts_with.
Return a JSON object: { "nodes": [{ "id": "Node1", "labels": ["Person"] }], "edges": [{ "source": "Node1", "target": "Node2", "type": "trusts" }] }`;
      return await this.generateJSON(ai, prompt, { nodes: [], edges: [] });
  }

  private static async generateJSON(ai: GoogleGenAI, prompt: string, defaultVal: any): Promise<any> {
      try {
          const resp = await generateWithRetry(ai, {
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: { responseMimeType: "application/json" }
          }, 3);
          return await cleanJSON(resp?.text || "{}", ai) || defaultVal;
      } catch (e) {
          console.warn("SCIL generation failed:", e);
          return defaultVal;
      }
  }

  static async storeSocialMemory(memory: any) {
    if (!db) return;
    try {
      await addDoc(collection(db, 'social_memory'), memory);
    } catch (e) {
      console.error('Error storing social memory:', e);
    }
  }
}
