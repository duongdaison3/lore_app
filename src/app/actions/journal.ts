"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { trackEvent } from "@/services/telemetry"

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

  await trackEvent(session.user.id, "mood_selected", { mood })

  return { entryId: entry.id }
}

export async function getPrompts() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      memories: { where: { status: "active" } }
    }
  })

  // Get today's mood
  const offset = new Date().getTimezoneOffset()
  const localDate = getLocalDateString(offset)
  const todayEntry = await prisma.dailyEntry.findUnique({
    where: { userId_localDate: { userId: session.user.id, localDate } }
  })

  const currentMood = todayEntry?.mood || "😐"

  // Get recent prompts history
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentAnswers = await prisma.entryAnswer.findMany({
    where: {
      entry: { userId: session.user.id },
      createdAt: { gte: thirtyDaysAgo }
    },
    include: { prompt: true }
  });

  const recentPrompts = recentAnswers.map((ans: any) => ({
    promptId: ans.promptId,
    date: ans.createdAt,
    text: ans.prompt.text
  }));

  let candidates = await prisma.prompt.findMany({
    where: { isFollowUp: false, active: true },
  })

  // If no candidates exist (e.g. database not seeded), create a default prompt
  if (candidates.length === 0) {
    const dummyPrompt = await prisma.prompt.create({
      data: {
        text: "Có điều gì đáng nhớ hôm nay không?",
        category: "reflection",
        tone: "gentle",
        isFollowUp: false,
        active: true,
        targetGoals: [],
        suitableMoods: ["😐", "🙂", "🥰", "🔥", "😵‍💫", "🫠"],
        language: "vi"
      }
    })
    candidates = [dummyPrompt]
  }

  // Initialize the engine
  const { getDailyPrompt } = await import('@/services/promptEngine')
  
  const primaryPrompts = await getDailyPrompt({
    currentMood,
    userPreferences: { preferredTones: user?.preferredTones || [] },
    recentPrompts,
    candidates,
    currentDate: new Date(),
    activeMemories: user?.memories || [],
    locale: "vi",
    userId: session.user.id
  });

  // We don't generate followUp upfront anymore. We return null.
  return { primary: primaryPrompts || [candidates[0]], followUp: null }
}

export async function generateContextualFollowUp(answer: string, locale: string = "vi") {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const offset = new Date().getTimezoneOffset()
  const localDate = getLocalDateString(offset)
  const todayEntry = await prisma.dailyEntry.findUnique({
    where: { userId_localDate: { userId: session.user.id, localDate } }
  })

  const currentMood = todayEntry?.mood || "😐"

  const { generateFollowUpPrompt } = await import('@/services/aiPromptEngine')
  
  const aiFollowUp = await generateFollowUpPrompt(answer, currentMood, locale, session.user.id);
  
  // Ensure we have a valid fallback follow-up prompt in DB to satisfy foreign key constraints
  let fallbackDbFollowUp = await prisma.prompt.findFirst({
    where: { isFollowUp: true, active: true }
  })
  
  if (!fallbackDbFollowUp) {
    fallbackDbFollowUp = await prisma.prompt.create({
      data: {
        text: "Bạn có thể chia sẻ thêm về điều này không?",
        category: "reflection",
        tone: "gentle",
        isFollowUp: true,
        active: true,
        targetGoals: [],
        suitableMoods: ["😐", "🙂", "🥰", "🔥", "😵‍💫", "🫠"],
        language: "vi"
      }
    })
  }
  
  if (aiFollowUp) {
    return {
      id: fallbackDbFollowUp.id,
      text: aiFollowUp.prompt,
      isFollowUp: true
    }
  }

  await trackEvent(session.user.id, "followup_offered", { promptId: fallbackDbFollowUp.id })

  return fallbackDbFollowUp
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
  
  await trackEvent(session.user.id, "draft_saved", { promptId })

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
      .map((a: any) => `Q: ${a.prompt.text}\nA: ${a.content}`)
      .join("\n\n")

    // Fire and forget AI memory extraction
    import("@/services/aiMemoryEngine").then(({ processJournalEntryForMemories }) => {
      if (session?.user?.id) {
        processJournalEntryForMemories(session.user.id, entryId, entryText).catch(console.error)
      }
    })
  }

  await trackEvent(session.user.id, "journal_completed", { entryId })

  return { success: true }
}

export async function trackFrontendEvent(eventName: string, metadata: Record<string, any> = {}) {
  const session = await auth()
  if (!session?.user?.id) return // Fail silently for tracking

  // Allow list of frontend events to prevent abuse
  const allowedEvents = [
    "journal_started",
    "prompt_viewed",
    "prompt_changed",
    "answer_started",
    "followup_accepted",
    "followup_completed"
  ]
  
  if (allowedEvents.includes(eventName)) {
    await trackEvent(session.user.id, eventName, metadata)
  }
}

