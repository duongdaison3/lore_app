import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

function getRotatedApiKey(): string | null {
  const rawKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!rawKey) return null;
  const keys = rawKey.split(',').map(k => k.replace(/["']/g, '').trim()).filter(Boolean);
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

export interface MonthlyFacts {
  year: number;
  month: number;
  totalEntries: number;
  activeDays: number;
  moodDistribution: { mood: string, count: number }[];
  topCategories: string[];
}

export async function getMonthlyFacts(userId: string, year: number, month: number): Promise<MonthlyFacts> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);

  const entries = await prisma.dailyEntry.findMany({
    where: {
      userId,
      createdAt: { gte: startDate, lte: endDate },
      isCompleted: true
    },
    include: {
      answers: { include: { prompt: true } }
    }
  });

  const totalEntries = entries.length;
  
  // Calculate active days (unique localDates)
  const uniqueDates = new Set(entries.map((e: any) => e.localDate));
  const activeDays = uniqueDates.size;

  // Mood distribution
  const moodCounts: Record<string, number> = {};
  entries.forEach((e: any) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({ mood, count })).sort((a, b) => b.count - a.count);

  // Top categories
  const categoryCounts: Record<string, number> = {};
  entries.forEach((e: any) => {
    e.answers.forEach((a: any) => {
      if (a.prompt?.category) {
        categoryCounts[a.prompt.category] = (categoryCounts[a.prompt.category] || 0) + 1;
      }
    });
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  return { year, month, totalEntries, activeDays, moodDistribution, topCategories };
}

export async function generateMonthlyReflection(facts: MonthlyFacts, locale: string = 'vi'): Promise<string | null> {
  if (facts.totalEntries === 0) return null;

  const apiKey = getRotatedApiKey();
  if (!apiKey) return null;

  const googleProvider = createGoogleGenerativeAI({ apiKey });
  
  try {
    const { object } = await generateObject({
      model: googleProvider('gemini-1.5-flash'),
      schema: z.object({ reflection: z.string() }),
      system: `
        You are a gentle, observant journaling AI.
        Write a short, editorial-style reflection for the user's monthly summary.
        
        Rules:
        1. Language must be ${locale}.
        2. Keep it to 2-3 short sentences.
        3. Do NOT diagnose or tell the user how they feel (e.g., "You are burned out").
        4. Focus on patterns (e.g., "Có vẻ tháng này công việc xuất hiện khá nhiều trong những điều bạn viết.").
        5. Tone should be intimate, calm, and deeply observant. Use natural conversational phrasing.
      `,
      prompt: `
        FACTS FOR THIS MONTH:
        Total Entries: ${facts.totalEntries}
        Active Days: ${facts.activeDays}
        Top Moods: ${facts.moodDistribution.slice(0, 2).map(m => m.mood).join(', ')}
        Top Categories: ${facts.topCategories.join(', ')}
        
        Write the reflection.
      `,
      abortSignal: AbortSignal.timeout(10000)
    });
    return object.reflection;
  } catch (error) {
    console.error("Failed to generate monthly reflection", error);
    return null;
  }
}

export async function getOnThisDayEntries(userId: string) {
  // Returns entries from exactly 1 year ago, 6 months ago, 1 month ago, or 1 week ago
  // Based on the user's local timezone. For simplicity we check localDate matching.
  const today = new Date();
  
  const getLocalDateOffset = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const targets = [
    { label: "1 year ago", dateStr: getLocalDateOffset(365) },
    { label: "6 months ago", dateStr: getLocalDateOffset(180) },
    { label: "1 month ago", dateStr: getLocalDateOffset(30) },
  ];

  const targetDates = targets.map(t => t.dateStr);

  const historical = await prisma.dailyEntry.findMany({
    where: {
      userId,
      localDate: { in: targetDates },
      isCompleted: true
    },
    include: {
      answers: {
        include: { prompt: true }
      }
    }
  });

  return historical.map((entry: any) => {
    const targetLabel = targets.find(t => t.dateStr === entry.localDate)?.label || "Past";
    return {
      label: targetLabel,
      localDate: entry.localDate,
      mood: entry.mood,
      answers: entry.answers.map((a: any) => ({
        promptText: a.prompt.text,
        content: a.content
      }))
    };
  });
}
