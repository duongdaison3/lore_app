import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string }
        })
        
        if (!user) return null
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        
        if (!isPasswordValid) return null
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    })
  ],
  pages: {
    signIn: "/vi/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    }
  }
})
