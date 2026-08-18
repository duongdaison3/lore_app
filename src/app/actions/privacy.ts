"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { trackEvent } from "@/services/telemetry"

export async function deleteMemory(memoryId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // IDOR check: ensure this memory belongs to the logged in user
  const memory = await prisma.memory.findUnique({
    where: { id: memoryId }
  })

  if (!memory || memory.userId !== session.user.id) {
    throw new Error("Unauthorized memory deletion")
  }

  await prisma.memory.delete({
    where: { id: memoryId }
  })
  
  await trackEvent(session.user.id, "memory_deleted", { type: memory.type })

  revalidatePath('/[locale]/settings', 'page')
  return { success: true }
}

export async function clearAllMemories() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.memory.deleteMany({
    where: { userId: session.user.id }
  })

  revalidatePath('/[locale]/settings', 'page')
  return { success: true }
}

export async function togglePersonalization(enabled: boolean) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { personalizationEnabled: enabled }
  })
  
  if (!enabled) {
    await trackEvent(session.user.id, "personalization_disabled")
  }

  revalidatePath('/[locale]/settings', 'page')
  return { success: true }
}

export async function deleteAccount() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // This will cascade and delete DailyEntries, EntryAnswers, Memories, and NotificationPreferences
  await prisma.user.delete({
    where: { id: session.user.id }
  })

  // We return success, then the client must call signOut() to clear the session cookie
  return { success: true }
}

export async function getPrivacyData() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { personalizationEnabled: true }
  })

  const memories = await prisma.memory.findMany({
    where: { userId: session.user.id, status: 'active' },
    include: {
      sourceEntry: { select: { localDate: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { 
    personalizationEnabled: user?.personalizationEnabled ?? true, 
    memories 
  }
}
