"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getMonthlyFacts, getOnThisDayEntries } from "@/services/loreEngine"
import { format, subDays, parseISO } from "date-fns"

export async function getDashboardData() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const userId = session.user.id

  // 1. Recent Entries
  const recentEntries = await prisma.dailyEntry.findMany({
    where: { userId },
    orderBy: { localDate: "desc" },
    take: 3,
    include: {
      answers: {
        include: {
          prompt: true
        }
      }
    }
  })

  // 2. Monthly Stats
  const today = new Date()
  const monthlyStats = await getMonthlyFacts(userId, today.getFullYear(), today.getMonth() + 1)

  // 3. On This Day
  const onThisDayArray = await getOnThisDayEntries(userId)
  const onThisDay = onThisDayArray.length > 0 ? onThisDayArray[0] : null

  // 4. Calculate Streak
  // Fetch recent distinct dates
  const dates = await prisma.dailyEntry.findMany({
    where: { userId },
    select: { localDate: true },
    orderBy: { localDate: "desc" },
    distinct: ['localDate']
  })

  let streak = 0
  if (dates.length > 0) {
    // Check if the latest entry is today or yesterday
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd')
    
    if (dates[0].localDate === todayStr || dates[0].localDate === yesterdayStr) {
      streak = 1
      let currentDate = parseISO(dates[0].localDate)
      
      for (let i = 1; i < dates.length; i++) {
        const expectedDate = format(subDays(currentDate, 1), 'yyyy-MM-dd')
        if (dates[i].localDate === expectedDate) {
          streak++
          currentDate = parseISO(dates[i].localDate)
        } else {
          break
        }
      }
    }
  }

  return {
    recentEntries,
    monthlyStats,
    onThisDay,
    streak
  }
}
