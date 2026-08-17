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
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t("login")}</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">{t("loginWelcome")}</p>
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
