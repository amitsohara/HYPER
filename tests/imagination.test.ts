import { describe, it, expect, vi } from 'vitest';
import { ImaginationEngine } from '../src/server/core/imagination/imagination_engine.js';
import { GoogleGenAI } from '@google/genai';

// Setup DEV_STUB mode to mock API calls
process.env.MODEL_MODE = 'dev_stub';
process.env.GEMINI_API_KEY = 'dummy';

describe('Imagination Engine', () => {
    const ai = new GoogleGenAI({ apiKey: 'dummy' });

    it('should run imagination pipeline and generate trace', async () => {
        const trace = await ImaginationEngine.runImagination(ai, 'test_mission', 'What if there were no laws of physics on Earth?');
        expect(trace).toBeDefined();
        expect(trace.premise_analysis).toBeDefined();
        expect(trace.imagined_world).toBeDefined();
        expect(trace.scene_graph).toBeDefined();
        expect(trace.perspectives).toBeDefined();
        expect(trace.scenarios).toBeDefined();
        expect(trace.counterfactuals).toBeDefined();
        expect(trace.possibility_space).toBeDefined();
        expect(trace.unknown_solution).toBeDefined();
    });
});
