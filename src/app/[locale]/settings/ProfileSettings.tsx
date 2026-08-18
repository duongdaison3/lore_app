"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "sonner"
import { updateProfile } from "@/app/actions/profile"

export function ProfileSettings({ initialProfile }: { initialProfile: any }) {
  const t = useTranslations("Profile")
  const tc = useTranslations("Common")
  
  const [name, setName] = useState(initialProfile?.name || "")
  const [bio, setBio] = useState(initialProfile?.bio || "")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await updateProfile({ name, bio })
      toast.success(t("updateSuccess"))
    } catch {
      toast.error(t("updateError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold text-[var(--foreground)]/80 border-b border-[var(--border)]/50 pb-4">
        {t("title")}
      </h2>
      
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-8 shadow-sm">
        {initialProfile?.avatarUrl && (
          <div className="flex justify-center sm:justify-start">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border)] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={initialProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        <div className="space-y-6 max-w-xl">
          <div className="space-y-3">
            <label className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              {t("displayName")}
            </label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder={t("displayNamePlaceholder")}
              className="h-12 bg-[var(--background)]/50"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
              {t("bio")}
            </label>
            <Textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder={t("bioPlaceholder")}
              className="resize-none h-24 bg-[var(--background)]/50"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleUpdate} 
              disabled={loading}
              className="rounded-full px-8 h-12 shadow-sm hover:shadow-md transition-all font-medium bg-[var(--primary)] text-[var(--primary-foreground)]"
            >
              {loading ? tc("loading") : t("updateBtn")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
