"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getRecapData() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const entries = await prisma.dailyEntry.findMany({
    where: { 
      userId: session.user.id,
      isCompleted: true
    },
    include: {
      answers: true
    },
    orderBy: {
      localDate: 'asc'
    }
  })

  if (entries.length === 0) {
    return null
  }

  const totalEntries = entries.length
  const firstEntryDate = entries[0].localDate

  // Calculate most frequent mood
  const moodCounts: Record<string, number> = {}
  let mostFrequentMood = ""
  let maxMoodCount = 0

  // Calculate total words
  let totalWords = 0

  // Streak calculation
  let currentStreak = 1
  let longestStreak = 1

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    
    // Mood
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
      if (moodCounts[entry.mood] > maxMoodCount) {
        maxMoodCount = moodCounts[entry.mood]
        mostFrequentMood = entry.mood
      }
    }

    // Words
    for (const ans of entry.answers) {
      if (ans.content) {
        totalWords += ans.content.split(/\s+/).filter((w: any) => w.length > 0).length
      }
    }

    // Streak
    if (i > 0) {
      const prevDate = new Date(entries[i-1].localDate)
      const currDate = new Date(entry.localDate)
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreak++
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }
      } else if (diffDays > 1) {
        currentStreak = 1
      }
    }
  }

  // Get some active memories to show
  const memories = await prisma.longTermMemory.findMany({
    where: { userId: session.user.id, status: 'active' },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  return {
    totalEntries,
    firstEntryDate,
    mostFrequentMood,
    totalWords,
    longestStreak,
    memories: memories.map((m: any) => m.content)
  }
}
