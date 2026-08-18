import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Fetch all user entries and answers
  const entries = await prisma.dailyEntry.findMany({
    where: { userId: session.user.id },
    include: {
      answers: {
        include: {
          prompt: { select: { text: true, category: true, tone: true } }
        }
      },
      memories: {
        select: { type: true, content: true, confidence: true }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  // Format into a clean JSON structure
  const exportData = {
    exportDate: new Date().toISOString(),
    user: session.user.name || session.user.email,
    entries: entries.map((entry: any) => ({
      date: entry.localDate,
      mood: entry.mood,
      createdAt: entry.createdAt,
      answers: entry.answers.map((a: any) => ({
        prompt: a.prompt.text,
        category: a.prompt.category,
        tone: a.prompt.tone,
        content: a.content,
        isDraft: a.isDraft,
        createdAt: a.createdAt
      })),
      memoriesInferred: entry.memories
    }))
  }

  const json = JSON.stringify(exportData, null, 2)

  return new NextResponse(json, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="lore-export-${new Date().toISOString().split('T')[0]}.json"`
    }
  })
}
