"use server"

import { signIn, signOut } from "@/auth"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function loginAction(formData: FormData) {
  await signIn("credentials", formData)
}

export async function logoutAction() {
  await signOut()
}

export async function registerAction(formData: FormData) {
  // In a real app, this should run through Zod validation.
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  })

  if (existing) {
    return { success: false, error: "User already exists" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        username,
        passwordHash
      }
    })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register user" }
  }
}
