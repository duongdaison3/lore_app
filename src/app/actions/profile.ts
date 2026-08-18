"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function getProfile() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      bio: true,
      avatarUrl: true,
    }
  })

  return user
}

export async function updateProfile(data: { name: string, bio: string }) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // Generate a simple avatar from initials if not present
  const initials = data.name 
    ? data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "L"
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${initials}&backgroundColor=000000,ffffff&textColor=ffffff,000000`

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      bio: data.bio,
      avatarUrl: avatarUrl
    }
  })

  revalidatePath("/", "layout")
  return { success: true }
}
