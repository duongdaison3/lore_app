"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getNotificationPreferences() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const pref = await prisma.notificationPreference.findUnique({
    where: { userId: session.user.id }
  })

  return pref || { enabled: false, preferredTime: "20:00", timezone: "UTC" }
}

export async function updateNotificationPreferences(data: { enabled: boolean, preferredTime: string, timezone: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.notificationPreference.upsert({
    where: { userId: session.user.id },
    update: {
      enabled: data.enabled,
      preferredTime: data.preferredTime,
      timezone: data.timezone
    },
    create: {
      userId: session.user.id,
      enabled: data.enabled,
      preferredTime: data.preferredTime,
      timezone: data.timezone
    }
  })

  revalidatePath('/[locale]/settings', 'page')
  return { success: true }
}
