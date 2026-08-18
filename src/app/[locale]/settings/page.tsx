import { getTranslations } from "next-intl/server"
import { getNotificationPreferences } from "@/app/actions/settings"
import { SettingsForm } from "./SettingsForm"
import { PrivacyCenter } from "./PrivacyCenter"
import { getPrivacyData } from "@/app/actions/privacy"

export default async function SettingsPage() {
  const t = await getTranslations("Settings")
  const prefs = await getNotificationPreferences()
  const privacyData = await getPrivacyData()

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)]/30 pb-32">
      <div className="max-w-2xl mx-auto px-6 pt-24 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        <header className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-serif text-[var(--foreground)] tracking-tight">
            {t("title")}
          </h1>
        </header>

        <SettingsForm initialPrefs={prefs} />
        <PrivacyCenter 
          memories={privacyData.memories} 
          initialPersonalization={privacyData.personalizationEnabled} 
        />
      </div>
    </div>
  )
}
