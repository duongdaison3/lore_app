"use client"

import { useState, useTransition, useEffect } from "react"
import { useTranslations } from "next-intl"
import { updateNotificationPreferences } from "@/app/actions/settings"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"

type Prefs = {
  enabled: boolean;
  preferredTime: string;
  timezone: string;
}

export function SettingsForm({ initialPrefs }: { initialPrefs: Prefs }) {
  const t = useTranslations("Settings")
  const [isPending, startTransition] = useTransition()
  
  const [enabled, setEnabled] = useState(initialPrefs.enabled)
  const [time, setTime] = useState(initialPrefs.preferredTime)
  const [timezone, setTimezone] = useState(initialPrefs.timezone)

  useEffect(() => {
    // Auto-detect timezone on mount if it's the default
    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detectedTz && timezone !== detectedTz) {
      setTimezone(detectedTz);
    }
  }, [timezone])

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateNotificationPreferences({ enabled, preferredTime: time, timezone })
        toast.success(t("saveSuccess"))
      } catch (err) {
        toast.error(t("saveError"))
      }
    })
  }

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h2 className="text-2xl font-heading font-semibold text-[var(--foreground)]/80 border-b border-[var(--border)]/50 pb-4">
          {t("notifications")}
        </h2>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          {t("notificationsDesc")}
        </p>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="font-medium text-[var(--foreground)]">{t("enableReminders")}</label>
              <p className="text-sm text-[var(--muted-foreground)]">{t("enableRemindersDesc")}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-[var(--muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--foreground)]"></div>
            </label>
          </div>

          <div className={`transition-opacity duration-300 space-y-6 ${enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="space-y-2">
              <label className="block font-medium text-[var(--foreground)]">{t("preferredTime")}</label>
              <p className="text-sm text-[var(--muted-foreground)] pb-2">{t("preferredTimeDesc")}</p>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
              {t("timezone")}: {timezone}
            </div>
          </div>

        </div>
      </section>

      <div className="pt-8 flex justify-end">
        <Button onClick={handleSave} disabled={isPending} className="rounded-full px-10 h-12 shadow-sm hover:shadow-md transition-all font-medium bg-[var(--primary)] text-[var(--primary-foreground)]">
          {isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  )
}
