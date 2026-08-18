import { getRecapData } from "@/app/actions/recap"
import { RecapStory } from "@/components/recap/RecapStory"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"

export default async function RecapPage() {
  const session = await auth()
  if (!session) redirect("/vi/login")

  const t = await getTranslations("Recap")
  const data = await getRecapData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col space-y-6">
        <h1 className="text-3xl font-heading text-center">{t("notEnoughData")}</h1>
        <p className="text-[var(--muted-foreground)] text-center max-w-md">{t("notEnoughDataDesc")}</p>
        <a href="/" className="px-6 py-3 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium">
          {t("backHome")}
        </a>
      </div>
    )
  }

  // We pass translations as a dict so the client component can use them easily
  const translations = {
    welcome: t("welcome"),
    welcomeSub: t("welcomeSub"),
    statsTitle: t("statsTitle"),
    totalDays: t("totalDays"),
    wordsWritten: t("wordsWritten"),
    longestStreak: t("longestStreak"),
    moodTitle: t("moodTitle"),
    moodDesc: t("moodDesc"),
    memoriesTitle: t("memoriesTitle"),
    memoriesDesc: t("memoriesDesc"),
    finishTitle: t("finishTitle"),
    finishDesc: t("finishDesc"),
    backHome: t("backHome")
  }

  return (
    <main className="fixed inset-0 z-50 bg-[var(--background)]">
      <RecapStory data={data} t={translations} />
    </main>
  )
}
