"use client"

import { useState } from "react"
import { registerAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"

export default function RegisterPage() {
  const t = useTranslations("Auth")
  const tc = useTranslations("Common")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await registerAction(formData)
      toast.success(t("registerSuccess"))
      router.push(`/${locale}/login`)
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || tc("error"))
      } else {
        toast.error(tc("error"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl">{t("register")}</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">{t("registerWelcome")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-sm font-medium">{t("fullName")}</label>
                 <Input name="name" required placeholder={t("namePlaceholder")} />
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium">{t("phone")}</label>
                 <Input name="phone" required placeholder={t("phonePlaceholder")} />
               </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("email")}</label>
              <Input type="email" name="email" required placeholder={t("emailPlaceholder")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("username")}</label>
              <Input name="username" required placeholder={t("usernamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("password")}</label>
              <Input type="password" name="password" required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("confirmPassword")}</label>
              <Input type="password" name="confirmPassword" required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? t("processing") : t("register")}
            </Button>
            <div className="text-center text-sm pt-4">
              {t("haveAccount")}{" "}
              <Link href={`/${locale}/login`} className="text-[var(--primary)] hover:underline">
                {t("login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
