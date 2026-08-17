"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// 1. Get today's local date string
function getLocalDateString(timezoneOffset: number) {
  const now = new Date()
  // Adjust for user's timezone offset (in minutes)
  const localDate = new Date(now.getTime() - timezoneOffset * 60000)
  return localDate.toISOString().split("T")[0] // YYYY-MM-DD
}

export async function saveMood(mood: string, timezoneOffset: number) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const localDate = getLocalDateString(timezoneOffset)

  // Find or create daily entry for today
  let entry = await prisma.dailyEntry.findUnique({
    where: {
      userId_localDate: {
        userId: session.user.id,
        localDate,
      },
    },
  })

  if (!entry) {
    entry = await prisma.dailyEntry.create({
      data: {
        userId: session.user.id,
        localDate,
        mood,
      },
    })
  } else if (entry.mood !== mood) {
    entry = await prisma.dailyEntry.update({
      where: { id: entry.id },
      data: { mood },
    })
  }

  return { entryId: entry.id }
}

export async function getPrompts() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // For simplicity, just return one primary and one followup prompt.
  // In reality, this would fetch from the DB or rotate based on seed.
  const primary = await prisma.prompt.findFirst({
    where: { isFollowUp: false, active: true },
  })
  
  const followUp = await prisma.prompt.findFirst({
    where: { isFollowUp: true, active: true },
  })

  return { primary, followUp }
}

export async function saveDraft(entryId: string, promptId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Upsert the entry answer
  await prisma.entryAnswer.upsert({
    where: {
      entryId_promptId: {
        entryId,
        promptId,
      },
    },
    update: {
      content,
      isDraft: true,
    },
    create: {
      entryId,
      promptId,
      content,
      isDraft: true,
    },
  })
  
  return { success: true }
}

export async function completeEntry(entryId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Mark all related answers as not draft, and the entry as completed
  await prisma.entryAnswer.updateMany({
    where: { entryId },
    data: { isDraft: false },
  })

  await prisma.dailyEntry.update({
    where: { id: entryId },
    data: { isCompleted: true },
  })

  return { success: true }
}
