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

  const entry = await prisma.dailyEntry.upsert({
    where: {
      userId_localDate: {
        userId: session.user.id,
        localDate,
      },
    },
    update: {
      mood,
    },
    create: {
      userId: session.user.id,
      localDate,
      mood,
    },
  })

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

  // Verify ownership of the entry before allowing drafting
  const entry = await prisma.dailyEntry.findUnique({
    where: { id: entryId },
    select: { userId: true },
  })

  if (!entry || entry.userId !== session.user.id) {
    throw new Error("Unauthorized: Entry not found or belongs to another user")
  }

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

  // Verify ownership of the entry before marking as complete
  const entry = await prisma.dailyEntry.findUnique({
    where: { id: entryId },
    select: { userId: true },
  })

  if (!entry || entry.userId !== session.user.id) {
    throw new Error("Unauthorized: Entry not found or belongs to another user")
  }

  // Mark all related answers as not draft, and the entry as completed
  await prisma.entryAnswer.updateMany({
    where: { entryId },
    data: { isDraft: false },
  })

  await prisma.dailyEntry.update({
    where: { id: entryId },
    data: { isCompleted: true },
  })

  // Fetch the full text to pass to the memory engine
  const fullEntry = await prisma.dailyEntry.findUnique({
    where: { id: entryId },
    include: { answers: { include: { prompt: true } } }
  })

  if (fullEntry) {
    const entryText = fullEntry.answers
      .map(a => `Q: ${a.prompt.text}\nA: ${a.content}`)
      .join("\n\n")

    // Fire and forget AI memory extraction
    import("@/services/aiMemoryEngine").then(({ processJournalEntryForMemories }) => {
      if (session?.user?.id) {
        processJournalEntryForMemories(session.user.id, entryId, entryText).catch(console.error)
      }
    })
  }

  return { success: true }
}
