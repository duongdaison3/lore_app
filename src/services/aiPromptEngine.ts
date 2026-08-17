import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { Prompt, PromptEngineContext, getDailyPrompt as getDeterministicPrompt } from './promptEngine';

export const promptSchema = z.object({
  prompt: z.string(),
  category: z.string(),
  tone: z.string(),
  intensity: z.number().min(1).max(10),
  follow_up_prompt: z.string().nullable().optional()
});

export type AIPromptResult = z.infer<typeof promptSchema>;

function logAIOperation(operation: string, latencyMs: number, success: boolean, model: string, error?: unknown) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    service: 'aiPromptEngine',
    operation,
    model,
    latencyMs,
    success,
    error: error instanceof Error ? error.message : String(error)
  }));
}

export function validatePrompt(rawOutput: unknown): AIPromptResult | null {
  const result = promptSchema.safeParse(rawOutput);
  if (result.success) {
    return result.data;
  }
  console.warn("AI prompt validation failed:", result.error.errors);
  return null;
}

export async function fallbackPrompt(context: PromptEngineContext): Promise<Prompt | null> {
  // Gracefully fallback to deterministic engine
  return getDeterministicPrompt(context);
}

export async function generatePersonalizedPrompt(
  candidatePromptText: string, 
  userMood: string, 
  preferredTones: string[]
): Promise<AIPromptResult | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.warn("GOOGLE_GENERATIVE_AI_API_KEY not found. Skipping AI personalization.");
    return null;
  }

  const model = 'gemini-1.5-flash';
  const startTime = Date.now();
  
  try {
    const { object } = await generateObject({
      model: google(model),
      schema: promptSchema,
      system: `
        You are a journaling AI for the app 'Lore'.
        Lore is a Vietnamese-first daily journaling web application. 
        The tone is: "Không cần viết hay. Viết như đang nhắn cho chính mình."
        
        TASK: Rewrite or personalize the given candidate prompt based on the user's current mood and preferred tones.
        
        Rules for the generated Vietnamese prompt:
        - Sound natural, do not feel machine-translated.
        - Be concise and easily answerable.
        - Respect the user's preferred tones if possible.
        - Do NOT diagnose, judge, or use manipulative emotional language.
        - Avoid clichés like "hãy", "bạn có bao giờ", "điều gì khiến bạn".
      `,
      prompt: `
        Candidate Prompt: "${candidatePromptText}"
        User's Current Mood: "${userMood}"
        User's Preferred Tones: [${preferredTones.join(', ')}]
        
        Return the result in strictly formatted JSON according to the schema.
      `,
      abortSignal: AbortSignal.timeout(5000)
    });

    const latency = Date.now() - startTime;
    // We can run through our explicit validatePrompt just to be extra sure, though ai SDK does it.
    const valid = validatePrompt(object);
    if (!valid) throw new Error("Validation failed");

    logAIOperation('generatePersonalizedPrompt', latency, true, model);
    return valid;
  } catch (error) {
    const latency = Date.now() - startTime;
    logAIOperation('generatePersonalizedPrompt', latency, false, model, error);
    return null;
  }
}

export async function generateFollowUpPrompt(
  previousAnswer: string,
  userMood: string
): Promise<AIPromptResult | null> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return null;
  }

  const model = 'gemini-1.5-flash';
  const startTime = Date.now();

  try {
    const { object } = await generateObject({
      model: google(model),
      schema: promptSchema,
      system: `
        You are a journaling AI for the app 'Lore'.
        TASK: Generate a single follow-up question based on the user's previous journal entry answer.
        
        Rules:
        - Must be in Vietnamese.
        - Must sound natural and empathetic.
        - Do not diagnose or make assumptions about the user's life.
        - Ask an open-ended, gently probing question.
      `,
      prompt: `
        User's Mood: "${userMood}"
        User's Answer: "${previousAnswer}"
        
        Generate the follow-up prompt in the structured JSON format.
      `,
      abortSignal: AbortSignal.timeout(5000)
    });

    const latency = Date.now() - startTime;
    const valid = validatePrompt(object);
    if (!valid) throw new Error("Validation failed");

    logAIOperation('generateFollowUpPrompt', latency, true, model);
    return valid;
  } catch (error) {
    const latency = Date.now() - startTime;
    logAIOperation('generateFollowUpPrompt', latency, false, model, error);
    return null;
  }
}
