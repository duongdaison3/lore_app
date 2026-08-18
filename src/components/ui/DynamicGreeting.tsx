"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function DynamicGreeting({ name }: { name: string }) {
  const t = useTranslations("Home")
  const [greeting, setGreeting] = useState("morning")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) setGreeting("morning")
    else if (hour >= 12 && hour < 18) setGreeting("afternoon")
    else if (hour >= 18 && hour < 22) setGreeting("evening")
    else setGreeting("night")
  }, [])

  return (
    <h1 suppressHydrationWarning className="text-3xl md:text-4xl font-heading font-semibold tracking-tight text-[var(--foreground)] transition-opacity duration-300">
      {t(greeting as any)} <span className="text-[var(--primary)]">{name}</span>
    </h1>
  )
}
