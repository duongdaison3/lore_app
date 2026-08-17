"use client"

import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

export function Navigation() {
  const t = useTranslations("Theme")
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <div className="font-semibold tracking-tight text-[var(--foreground)]">Lore</div>
        <nav className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title={theme === "dark" ? t("toggleLight") : t("toggleDark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
