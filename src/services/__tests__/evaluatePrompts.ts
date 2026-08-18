import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { promptFixtures } from './promptFixtures';
import dotenv from 'dotenv';
dotenv.config();

const evaluationSchema = z.object({
  relation: z.enum(["exact_duplicate", "semantic_duplicate", "healthy_variation"]),
  reasoning: z.string()
});

async function evaluatePair(prompt1: string, prompt2: string) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("Missing API Key");

  const googleProvider = createGoogleGenerativeAI({ apiKey });
  
  const { object } = await generateObject({
    model: googleProvider('gemini-1.5-flash'),
    schema: evaluationSchema,
    system: `
      You are an expert prompt evaluator for a daily journaling app.
      Evaluate the relationship between Prompt 1 and Prompt 2.
      
      Classifications:
      - exact_duplicate: Virtually identical in wording and meaning.
      - semantic_duplicate: Different wording, but the user would give the exact same answer (e.g. "What made you happy?" vs "What brought you joy?").
      - healthy_variation: Related topic but asks from a different angle, structure, or level of abstraction (e.g. "What made you happy?" vs "If today was a color, would it be a happy one?").
    `,
    prompt: `
      Prompt 1: "${prompt1}"
      Prompt 2: "${prompt2}"
    `
  });

  return object;
}

async function runEvaluation() {
  console.log("Starting Prompt Semantic Evaluation...");
  let correct = 0;
  
  // Test a sample to avoid rate limits in this quick script
  const sample = [
    promptFixtures[0], // semantic
    promptFixtures[15], // exact
    promptFixtures[30], // variation
  ];

  for (const pair of sample) {
    const result = await evaluatePair(pair.prompt1, pair.prompt2);
    const isCorrect = result.relation === pair.relation;
    if (isCorrect) correct++;
    
    console.log(`[${isCorrect ? 'PASS' : 'FAIL'}] Expected: ${pair.relation}, Got: ${result.relation}`);
    console.log(`P1: ${pair.prompt1}`);
    console.log(`P2: ${pair.prompt2}`);
    console.log(`Reasoning: ${result.reasoning}\n`);
  }
  
  console.log(`Accuracy: ${correct}/${sample.length}`);
}

if (require.main === module) {
  runEvaluation().catch(console.error);
}
