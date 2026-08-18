export interface Prompt {
  id: string;
  text: string;
  category: string;
  tone: string;
  intensity: number;
  suitableMoods: string[];
  cooldownDays: number;
}

export interface UserPreferences {
  preferredTones: string[];
}

export interface PromptEngineContext {
  currentMood: string;
  userPreferences: UserPreferences;
  // History of prompt IDs shown to this user, along with the date shown and the actual generated text
  recentPrompts: { promptId: string; date: Date; text?: string }[];
  // Candidate prompts from the database
  candidates: Prompt[];
  currentDate: Date;
  activeMemories?: { type: string; content: string }[];
  locale?: string;
  userId?: string;
}

export async function getDailyPrompt(context: PromptEngineContext): Promise<Prompt | null> {
  const { currentMood, userPreferences, recentPrompts, candidates, currentDate } = context;

  if (!candidates || candidates.length === 0) {
    return null;
  }

  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  // 1. Filter out prompts that violate their cooldown
  const availableCandidates = candidates.filter((prompt) => {
    const lastSeen = recentPrompts.find((rp) => rp.promptId === prompt.id);
    if (!lastSeen) return true;

    const daysSinceSeen = (currentDate.getTime() - lastSeen.date.getTime()) / DAY_IN_MS;
    return daysSinceSeen >= prompt.cooldownDays;
  });

  // Fallback: If all prompts are in cooldown, ignore cooldowns but prioritize least recently used
  const pool = availableCandidates.length > 0 ? availableCandidates : candidates;

  // 2. Score remaining prompts
  const scoredPrompts = pool.map((prompt) => {
    let score = 0;

    // Mood matching (+10 points)
    if (prompt.suitableMoods.includes(currentMood)) {
      score += 10;
    }

    // Tone preference matching (+5 points)
    if (userPreferences.preferredTones.includes(prompt.tone)) {
      score += 5;
    }

    // Category diversity penalty (penalize if the same category was seen recently)
    const recentCategories = recentPrompts
      .filter((rp) => (currentDate.getTime() - rp.date.getTime()) / DAY_IN_MS <= 3) // Last 3 days
      .map((rp) => candidates.find((c) => c.id === rp.promptId)?.category)
      .filter(Boolean);

    if (recentCategories.includes(prompt.category)) {
      score -= 5;
    }

    // Add slight random jitter to prevent deterministic loops
    // In unit tests, we'll mock Math.random to make it deterministic if needed, 
    // or just rely on the score spread. We'll use a very small jitter.
    score += Math.random();

    // If we are in fallback mode (pool == candidates), heavily penalize recently seen
    if (availableCandidates.length === 0) {
      const lastSeen = recentPrompts.find((rp) => rp.promptId === prompt.id);
      if (lastSeen) {
        const daysSinceSeen = (currentDate.getTime() - lastSeen.date.getTime()) / DAY_IN_MS;
        // Negative penalty that decays over time
        score -= (30 - Math.min(daysSinceSeen, 30));
      }
    } else {
      // Freshness bonus: rewards prompts not seen in a long time (or never seen)
      const lastSeen = recentPrompts.find((rp) => rp.promptId === prompt.id);
      if (lastSeen) {
        const daysSinceSeen = (currentDate.getTime() - lastSeen.date.getTime()) / DAY_IN_MS;
        score += Math.min(daysSinceSeen * 0.5, 15); // Max 15 points for freshness
      } else {
        score += 20; // 20 points for completely fresh prompts
      }
    }

    return { prompt, score };
  });

  // 3. Sort by score descending
  scoredPrompts.sort((a, b) => b.score - a.score);

  const bestCandidate = scoredPrompts[0].prompt;

  // 4. Augment with AI if possible (fallback to candidate if AI fails)
  try {
    const { generatePersonalizedPrompt } = await import('./aiPromptEngine');
    const recentTexts = context.recentPrompts.map(rp => rp.text).filter((t): t is string => !!t);

    const aiResult = await generatePersonalizedPrompt(
      bestCandidate.text,
      currentMood,
      userPreferences.preferredTones,
      context.activeMemories || [],
      context.locale || 'vi',
      recentTexts,
      context.userId
    );

    if (aiResult) {
      return {
        ...bestCandidate,
        text: aiResult.prompt,
        category: aiResult.category,
        tone: aiResult.tone,
        intensity: aiResult.intensity
      };
    }
  } catch (err) {
    console.error("Failed to load or execute AI personalization", err);
  }

  return bestCandidate;
}
