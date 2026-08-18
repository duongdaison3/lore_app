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
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const t = useTranslations("Auth")
  const tc = useTranslations("Common")
  const locale = useLocale()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const result = await registerAction(formData)
      if (result.success) {
        toast.success(t("registerSuccess"))
        router.push(`/${locale}/login`)
      } else {
        toast.error(result.error || tc("error"))
      }
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
    <div className="relative flex min-h-[75vh] items-center justify-center p-4 overflow-hidden my-8">
      <div className="glass-panel w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl rounded-3xl p-8 md:p-10 relative z-10">
        <div className="text-center space-y-3 pb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-[var(--foreground)]">{t("register")}</h1>
          <p className="text-base text-[var(--muted-foreground)] font-sans">{t("registerWelcome")}</p>
        </div>
        <div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("confirmPassword")}</label>
              <div className="relative">
                <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required placeholder="••••••••" className="pr-10" />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

            <Button type="submit" className="w-full rounded-full h-12 text-base font-medium mt-4 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all bg-[var(--primary)] text-[var(--primary-foreground)]" disabled={loading}>
              {loading ? t("processing") : t("register")}
            </Button>
            <div className="text-center text-sm pt-6">
              {t("haveAccount")}{" "}
              <Link href={`/${locale}/login`} className="text-[var(--primary)] hover:text-[var(--accent)] font-medium hover:underline transition-colors">
                {t("login")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
