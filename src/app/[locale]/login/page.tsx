"use client"

import { useState } from "react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { toast } from "sonner"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function LoginPage() {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append("redirectTo", `/${locale}`)
    try {
      await loginAction(formData)
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("CredentialsSignin")) {
         toast.error(t("loginError"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center p-4 overflow-hidden">
      {/* Artistic glowing orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-[var(--primary)]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Card className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500 shadow-xl border-[var(--border)]/50 bg-[var(--card)]/90 backdrop-blur-md rounded-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-3xl font-heading tracking-tight">{t("login")}</CardTitle>
          <p className="text-base text-[var(--muted-foreground)] font-sans">{t("loginWelcome")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("username")}</label>
              <Input name="username" required placeholder={t("usernamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("password")}</label>
              <Input type="password" name="password" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? t("processing") : t("login")}
            </Button>
            <div className="text-center text-sm pt-4">
              {t("noAccount")}{" "}
              <Link href={`/${locale}/register`} className="text-[var(--primary)] hover:underline">
                {t("register")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
