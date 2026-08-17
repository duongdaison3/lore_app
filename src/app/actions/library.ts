"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getJournalEntries({
  q,
  mood,
  date,
  skip = 0,
  take = 20
}: {
  q?: string
  mood?: string
  date?: string // YYYY-MM-DD
  skip?: number
  take?: number
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { userId: session.user.id }

  if (mood) {
    where.mood = mood
  }

  if (date) {
    where.localDate = date
  }

  if (q) {
    where.OR = [
      {
        answers: {
          some: {
            content: { contains: q, mode: "insensitive" }
          }
        }
      },
      {
        answers: {
          some: {
            prompt: {
              text: { contains: q, mode: "insensitive" }
            }
          }
        }
      }
    ]
  }

  const entries = await prisma.dailyEntry.findMany({
    where,
    orderBy: { localDate: "desc" },
    skip,
    take,
    include: {
      answers: {
        include: {
          prompt: true
        }
      }
    }
  })

  const total = await prisma.dailyEntry.count({ where })

  return { entries, total }
}

export async function getJournalEntryById(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const entry = await prisma.dailyEntry.findUnique({
    where: { id, userId: session.user.id },
    include: {
      answers: {
        include: {
          prompt: true
        }
      }
    }
  })

  return entry
}

export async function deleteJournalEntry(id: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Ensure user owns it
  const entry = await prisma.dailyEntry.findUnique({ where: { id } })
  if (!entry || entry.userId !== session.user.id) throw new Error("Not found")

  await prisma.dailyEntry.delete({
    where: { id }
  })

  revalidatePath("/vi/library")
  return { success: true }
}

export async function updateEntryAnswers(updates: { id: string; content: string }[]) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  for (const update of updates) {
    // Validate ownership implicitly by checking entry
    const answer = await prisma.entryAnswer.findUnique({
      where: { id: update.id },
      include: { entry: true }
    })
    
    if (!answer || answer.entry.userId !== session.user.id) continue

    await prisma.entryAnswer.update({
      where: { id: update.id },
      data: { content: update.content }
    })
  }

  return { success: true }
}
