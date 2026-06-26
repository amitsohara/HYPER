import { describe, it, expect } from 'vitest';
import { HyperMindCognitiveCore } from '../src/server/core/hcc/cognitive_core';

describe('HyperMindCognitiveCore', () => {
  it('initializes with correct default state', () => {
    const core = new HyperMindCognitiveCore('Test Mission');
    const state = core.getState();
    
    expect(state.mission).toBe('Test Mission');
    expect(state.mission_stage).toBe('INITIALIZING');
    expect(state.goal_stack.length).toBe(1);
    expect(state.goal_stack[0].description).toBe('Test Mission');
  });

  it('handles state updates with version incrementing', () => {
    const core = new HyperMindCognitiveCore('Test Mission');
    const v1 = core.getState().version;
    
    core.updateState({ mission_stage: 'EXECUTING' }, 'TEST');
    
    const state = core.getState();
    expect(state.mission_stage).toBe('EXECUTING');
    expect(state.version).toBeGreaterThan(v1);
  });

  it('manages events properly', () => {
    const core = new HyperMindCognitiveCore('Test Mission');
    let fired = false;
    
    core.subscribe('RESEARCH_COMPLETED', (event) => {
      fired = true;
      expect(event.payload.data).toBe('test');
    });

    core.publishEvent('RESEARCH_COMPLETED', { data: 'test' }, 'TEST_MODULE');
    expect(fired).toBe(true);

    const state = core.getState();
    const event = state.events.find((e: any) => e.type === 'RESEARCH_COMPLETED');
    expect(event).toBeDefined();
    expect(event?.sourceModule).toBe('TEST_MODULE');
  });

  it('manages working memory with capacity and relevance', () => {
    const core = new HyperMindCognitiveCore('Test Mission');
    
    core.addWorkingMemory('Fact 1', 0.8);
    core.addWorkingMemory('Fact 2', 0.9);
    
    const state = core.getState();
    expect(state.working_memory.length).toBe(2);
    // Should be sorted by relevance
    expect(state.working_memory[0]).toBe('Fact 2');
    expect(state.working_memory[1]).toBe('Fact 1');
  });

  it('calculates confidence correctly based on evidence', () => {
    const core = new HyperMindCognitiveCore('Test Mission');
    
    core.addEvidence({
      description: 'High quality data',
      source: 'DB',
      confidence: 90,
      quality: 'HIGH',
      module: 'A'
    });
    
    core.addEvidence({
      description: 'Medium quality data',
      source: 'DB',
      confidence: 60,
      quality: 'MEDIUM',
      module: 'B'
    });

    const state = core.getState();
    // 1 HIGH = 15, 1 MEDIUM = 5, 2 modules = 10 -> total 30
    expect(state.confidence.score).toBe(30);
    expect(state.confidence.uncertainty).toBe(70);
  });
});
