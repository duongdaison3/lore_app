"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getMonthlyFacts, generateMonthlyReflection, getOnThisDayEntries } from "@/services/loreEngine"
import { revalidatePath } from "next/cache"

export async function getYourLore(locale: string = 'vi') {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const userId = session.user.id;

  // 1. On This Day
  const onThisDay = await getOnThisDayEntries(userId);

  // 2. Monthly Lore (Current Month)
  const today = new Date();
  const facts = await getMonthlyFacts(userId, today.getFullYear(), today.getMonth() + 1);
  const reflection = await generateMonthlyReflection(facts, locale);

  // 3. Memory Highlights
  const memories = await prisma.memory.findMany({
    where: { userId, status: 'active' },
    orderBy: { confidence: 'desc' }
  });

  const highlights = {
    tinyWins: memories.filter((m: any) => m.type === 'tiny_win'),
    plotTwists: memories.filter((m: any) => m.type === 'plot_twist'),
    people: memories.filter((m: any) => m.type === 'person'),
    themes: memories.filter((m: any) => m.type === 'recurring_theme'),
    milestones: memories.filter((m: any) => m.type === 'important_event')
  };

  return {
    onThisDay,
    monthlyLore: { facts, reflection },
    highlights
  };
}

export async function hideMemory(memoryId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.memory.update({
    where: { id: memoryId, userId: session.user.id },
    data: { status: 'rejected' }
  });

  revalidatePath('/lore')
  revalidatePath('/[locale]/lore')
}
