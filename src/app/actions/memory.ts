"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getUserMemories() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { personalizationEnabled: true }
  })

  const memories = await prisma.memory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return {
    personalizationEnabled: user?.personalizationEnabled ?? true,
    memories
  }
}

export async function deleteMemory(memoryId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Ensure user owns the memory
  await prisma.memory.delete({
    where: { 
      id: memoryId,
      userId: session.user.id // Prisma lets you compound check, but in some DB setups we might need find then delete or compound key
    }
  }).catch(() => {
    throw new Error("Memory not found or unauthorized")
  })

  return { success: true }
}

export async function togglePersonalization(enabled: boolean) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: session.user.id },
    data: { personalizationEnabled: enabled }
  })

  return { success: true }
}

export async function clearAllMemories() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.memory.deleteMany({
    where: { userId: session.user.id }
  })

  return { success: true }
}
