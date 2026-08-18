"use client"

import { useTranslations, useLocale } from "next-intl"
import { useTheme } from "next-themes"
import { Moon, Sun, Globe, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { logoutAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"

export function Navigation({ isAuthenticated }: { isAuthenticated: boolean }) {
  const tTheme = useTranslations("Theme")
  const tAuth = useTranslations("Auth")
  const tNav = useTranslations("Navigation")
  const { theme, setTheme } = useTheme()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const toggleLanguage = () => {
    const newLocale = locale === "vi" ? "en" : "vi"
    let newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    if (!newPath.startsWith(`/${newLocale}`)) {
       newPath = `/${newLocale}${pathname}`
    }
    router.push(newPath)
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image 
            src="/lore/Logo_without_background.png" 
            alt="Lore" 
            width={120} 
            height={40} 
            className="h-8 w-auto object-contain dark:invert"
            priority
          />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href={`/${locale}/login`} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2">
                {tAuth("login")}
              </Link>
              <Link href={`/${locale}/register`}>
                <Button size="sm" variant="default" className="rounded-full">
                  {tAuth("register")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href={`/${locale}/library`} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2">
                {tNav("library")}
              </Link>
              <Link href={`/${locale}/lore`} className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2">
                {tNav("lore")}
              </Link>
              <Link href={`/${locale}/settings`} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2" title={tNav("settings")}>
                <Settings className="h-4 w-4" />
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-2">
                  {tAuth("logout")}
                </button>
              </form>
            </div>
          )}

          <div className="h-4 w-px bg-[var(--border)] mx-1" />

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 rounded-full px-2 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <Globe className="h-4 w-4" />
            {locale.toUpperCase()}
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            title={theme === "dark" ? tTheme("toggleLight") : tTheme("toggleDark")}
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
