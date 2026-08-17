import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDailyPrompt, Prompt, PromptEngineContext } from '../promptEngine';

describe('Prompt Engine', () => {
  beforeEach(() => {
    // Mock Math.random to make jitter deterministic
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  const mockCandidates: Prompt[] = [
    { id: '1', text: 'Prompt 1', category: 'reflection', tone: 'deep', intensity: 5, suitableMoods: ['😐'], cooldownDays: 5 },
    { id: '2', text: 'Prompt 2', category: 'memory', tone: 'gentle', intensity: 3, suitableMoods: ['🙂'], cooldownDays: 5 },
    { id: '3', text: 'Prompt 3', category: 'unhinged', tone: 'playful', intensity: 7, suitableMoods: ['🔥'], cooldownDays: 5 },
    { id: '4', text: 'Prompt 4', category: 'reflection', tone: 'deep', intensity: 5, suitableMoods: ['😐'], cooldownDays: 5 },
  ];

  it('selects the best prompt based on mood', async () => {
    const context: PromptEngineContext = {
      currentMood: '🔥',
      userPreferences: { preferredTones: [] },
      recentPrompts: [],
      candidates: mockCandidates,
      currentDate: new Date('2026-08-17T00:00:00Z'),
    };

    const result = await getDailyPrompt(context);
    expect(result?.id).toBe('3');
  });

  it('selects based on user tone preference if mood matches multiple', async () => {
    const context: PromptEngineContext = {
      currentMood: '😐',
      userPreferences: { preferredTones: ['gentle'] },
      recentPrompts: [],
      candidates: [
        { id: '1', text: 'P1', category: 'a', tone: 'deep', intensity: 1, suitableMoods: ['😐'], cooldownDays: 5 },
        { id: '2', text: 'P2', category: 'b', tone: 'gentle', intensity: 1, suitableMoods: ['😐'], cooldownDays: 5 },
      ],
      currentDate: new Date('2026-08-17T00:00:00Z'),
    };

    const result = await getDailyPrompt(context);
    expect(result?.id).toBe('2'); // Match tone
  });

  it('filters out prompts in cooldown period', async () => {
    const context: PromptEngineContext = {
      currentMood: '😐',
      userPreferences: { preferredTones: [] },
      recentPrompts: [
        { promptId: '1', date: new Date('2026-08-15T00:00:00Z') } // 2 days ago
      ],
      candidates: mockCandidates,
      currentDate: new Date('2026-08-17T00:00:00Z'),
    };

    const result = await getDailyPrompt(context);
    // 1 is in cooldown (5 days), 4 is not
    expect(result?.id).toBe('4');
  });

  it('penalizes recently seen categories', async () => {
    const context: PromptEngineContext = {
      currentMood: '😐',
      userPreferences: { preferredTones: [] },
      recentPrompts: [
        // Saw prompt 4 (reflection) 2 days ago
        { promptId: '4', date: new Date('2026-08-15T00:00:00Z') } 
      ],
      candidates: mockCandidates,
      currentDate: new Date('2026-08-17T00:00:00Z'),
    };

    // Prompt 1 is also 'reflection'. It should be penalized.
    // Mood '😐' would normally pick 1, but since 'reflection' is penalized, 
    // does it still pick 1 over 2? 
    // 1 score = 10 (mood) - 5 (category penalty) = 5
    // 2 score = 0 (mood) = 0
    // Actually, 1 still wins because mood weight (10) > category penalty (5).
    // Let's modify the test so candidates have the same mood.
    const context2: PromptEngineContext = {
      ...context,
      candidates: [
        { id: '1', text: 'P1', category: 'reflection', tone: 'deep', intensity: 1, suitableMoods: ['😐'], cooldownDays: 5 },
        { id: '2', text: 'P2', category: 'memory', tone: 'deep', intensity: 1, suitableMoods: ['😐'], cooldownDays: 5 },
        { id: '4', text: 'Prompt 4', category: 'reflection', tone: 'deep', intensity: 5, suitableMoods: ['😐'], cooldownDays: 5 },
      ]
    };

    const result = await getDailyPrompt(context2);
    // Both match mood (+10). 1 is reflection (-5 penalty). 2 is memory (no penalty).
    // 2 should win.
    expect(result?.id).toBe('2');
  });

  it('falls back gracefully when all candidates are in cooldown', async () => {
    const context: PromptEngineContext = {
      currentMood: '😐',
      userPreferences: { preferredTones: [] },
      recentPrompts: [
        { promptId: '1', date: new Date('2026-08-16T00:00:00Z') }, // 1 day ago
        { promptId: '2', date: new Date('2026-08-10T00:00:00Z') }, // 7 days ago (but cooldown is 10)
      ],
      candidates: [
        { id: '1', text: 'P1', category: 'a', tone: 'deep', intensity: 1, suitableMoods: ['😐'], cooldownDays: 10 },
        { id: '2', text: 'P2', category: 'b', tone: 'deep', intensity: 1, suitableMoods: ['😐'], cooldownDays: 10 },
      ],
      currentDate: new Date('2026-08-17T00:00:00Z'),
    };

    const result = await getDailyPrompt(context);
    // Both are in cooldown. Fallback mode ignores cooldown but penalizes based on how recent they are.
    // 2 was seen 7 days ago, 1 was seen 1 day ago. 2 should win.
    expect(result?.id).toBe('2');
  });
});
