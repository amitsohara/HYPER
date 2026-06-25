import fs from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;
import neo4j from 'neo4j-driver';
import { QdrantClient } from '@qdrant/js-client-rest';

const DB_FILE = path.join(process.cwd(), 'persistent_brain.json');

export interface MemoryDB {
  episodic: any[];
  semantic: any[];
  procedural: any[];
  concepts: any[];
  beliefs: any[];
}

const defaultDB: MemoryDB = {
  episodic: [],
  semantic: [],
  procedural: [],
  concepts: [],
  beliefs: []
};

// Database connections
export const pgPool = process.env.PG_CONNECTION_STRING 
    ? new Pool({ connectionString: process.env.PG_CONNECTION_STRING }) 
    : null;

export const neo4jDriver = process.env.NEO4J_URI && process.env.NEO4J_USER && process.env.NEO4J_PASSWORD
    ? neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD))
    : null;

export const qdrantClient = process.env.QDRANT_URL
    ? new QdrantClient({ url: process.env.QDRANT_URL })
    : null;

export class PersistentBrainDB {
  static async load(): Promise<MemoryDB> {
    // If external databases are configured, we should load from them.
    // For now, if we have them, we still sync with local file for preview
    // In a full implementation, this would run actual queries to reconstruct MemoryDB.
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = await fs.promises.readFile(DB_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load DB', e);
    }
    return defaultDB;
  }

  static async save(db: MemoryDB) {
    try {
      // 1. Save to JSON as fallback
      await fs.promises.writeFile(DB_FILE, JSON.stringify(db, null, 2));

      // 2. Mirror episodic memories to Postgres
      if (pgPool && db.episodic.length > 0) {
          const latest = db.episodic[db.episodic.length - 1];
          // Ensure table exists (in real app this is a migration)
          await pgPool.query(`
             CREATE TABLE IF NOT EXISTS episodic_memories (
                id VARCHAR(255) PRIMARY KEY,
                content TEXT,
                timestamp TIMESTAMP,
                importance FLOAT
             )
          `);
          await pgPool.query(
             `INSERT INTO episodic_memories (id, content, timestamp, importance) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
             [latest.id, JSON.stringify(latest), new Date(latest.timestamp), latest.importance || 1.0]
          );
      }

      // 3. Mirror concepts to Neo4j
      if (neo4jDriver && db.concepts.length > 0) {
          const session = neo4jDriver.session();
          try {
              const latest = db.concepts[db.concepts.length - 1];
              await session.run(
                  `MERGE (c:Concept {name: $name}) SET c.strength = $strength`,
                  { name: latest.name, strength: latest.strength || 1.0 }
              );
              for (const rel of (latest.connections || [])) {
                  await session.run(
                      `MERGE (c:Concept {name: $name})
                       MERGE (r:Concept {name: $rel})
                       MERGE (c)-[:RELATED_TO]->(r)`,
                      { name: latest.name, rel }
                  );
              }
          } finally {
              await session.close();
          }
      }

      // 4. Mirror semantic facts to Qdrant (mocking embeddings for now)
      if (qdrantClient && db.semantic.length > 0) {
          try {
              const latest = db.semantic[db.semantic.length - 1];
              // Assuming a collection named "semantic_memory" exists with vector size 768
              const collections = await qdrantClient.getCollections();
              if (!collections.collections.some(c => c.name === 'semantic_memory')) {
                  await qdrantClient.createCollection('semantic_memory', {
                      vectors: { size: 768, distance: 'Cosine' }
                  });
              }
              // We simulate an embedding vector here since we don't want to block on a real embedding call
              const mockVector = new Array(768).fill(0).map(() => Math.random());
              await qdrantClient.upsert('semantic_memory', {
                  wait: true,
                  points: [
                      {
                          id: parseInt(latest.id, 36) || Math.floor(Math.random() * 1000000), // Qdrant requires unsigned int or UUID
                          vector: mockVector,
                          payload: { concept: latest.concept, fact: latest.fact, timestamp: latest.timestamp }
                      }
                  ]
              });
          } catch(e) {
              console.error('Qdrant error:', e);
          }
      }

    } catch (e) {
      console.error('Failed to save DB to external stores', e);
    }
  }
}
