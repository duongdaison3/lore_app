"use client"

import { useState } from "react"
import { loginAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { toast } from "sonner"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const t = useTranslations("Auth")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="relative flex min-h-[75vh] items-center justify-center p-4 overflow-hidden">
      <div className="glass-panel w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl rounded-3xl p-8 md:p-10 relative z-10">
        <div className="text-center space-y-3 pb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-[var(--foreground)]">{t("login")}</h1>
          <p className="text-base text-[var(--muted-foreground)] font-sans">{t("loginWelcome")}</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("username")}</label>
              <Input name="username" required placeholder={t("usernamePlaceholder")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("password")}</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" className="pr-10" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 pt-2">
              <input 
                type="checkbox" 
                id="agreeTerms" 
                name="agreeTerms" 
                required 
                className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)]"
              />
              <label htmlFor="agreeTerms" className="text-sm text-[var(--muted-foreground)] leading-tight">
                {t("agreeTerms")} <Link href={`/${locale}/terms`} className="text-[var(--primary)] hover:underline" target="_blank">{t("terms")}</Link> {t("and")} <Link href={`/${locale}/privacy-policy`} className="text-[var(--primary)] hover:underline" target="_blank">{t("privacy")}</Link>.
              </label>
            </div>

            <Button type="submit" className="w-full rounded-full h-12 text-base font-medium mt-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all bg-[var(--primary)] text-[var(--primary-foreground)]" disabled={loading}>
              {loading ? t("processing") : t("login")}
            </Button>
            <div className="text-center text-sm pt-6">
              {t("noAccount")}{" "}
              <Link href={`/${locale}/register`} className="text-[var(--primary)] hover:text-[var(--accent)] font-medium hover:underline transition-colors">
                {t("register")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
