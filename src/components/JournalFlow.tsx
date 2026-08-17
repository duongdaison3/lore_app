"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { saveMood, saveDraft, completeEntry } from "@/app/actions/journal"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const MOODS = ["😵‍💫", "😐", "🙂", "🥰", "🔥", "🫠"]

interface Prompt {
  id: string
  text: string
  isFollowUp: boolean
}

export function JournalFlow({ initialPrompts }: { initialPrompts: { primary: Prompt | null, followUp: Prompt | null } }) {
  const t = useTranslations("Journal")
  const locale = useLocale()
  const [step, setStep] = useState<"mood" | "primary" | "followup" | "complete">("mood")
  const [entryId, setEntryId] = useState<string | null>(null)
  
  const router = useRouter()
  
  const [primaryAnswer, setPrimaryAnswer] = useState("")
  const [followUpAnswer, setFollowUpAnswer] = useState("")

  const handleMoodSelect = async (selectedMood: string) => {
    try {
      const offset = new Date().getTimezoneOffset()
      const { entryId } = await saveMood(selectedMood, offset)
      setEntryId(entryId)
      setStep("primary")
    } catch {
      toast.error(t("error"))
    }
  }

  const handlePrimarySave = async () => {
    if (!entryId || !initialPrompts.primary) return
    try {
      await saveDraft(entryId, initialPrompts.primary.id, primaryAnswer)
      if (initialPrompts.followUp) {
        setStep("followup")
      } else {
        await handleComplete()
      }
    } catch {
      toast.error(t("error"))
    }
  }

  const handleComplete = async () => {
    if (!entryId) return
    try {
      if (step === "followup" && initialPrompts.followUp && followUpAnswer) {
        await saveDraft(entryId, initialPrompts.followUp.id, followUpAnswer)
      }
      await completeEntry(entryId)
      setStep("complete")
    } catch {
      toast.error(t("error"))
    }
  }

  if (step === "mood") {
    return (
      <div className="flex flex-col items-center justify-center space-y-12 py-16 animate-in fade-in duration-700">
        <h2 className="text-3xl font-medium tracking-tight">{t("vibeQuestion")}</h2>
        <div className="grid grid-cols-3 gap-6 sm:grid-cols-6">
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => handleMoodSelect(m)}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--card)] text-4xl shadow-sm transition-all hover:scale-110 hover:shadow-md hover:bg-[var(--muted)]"
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (step === "primary") {
    return (
      <div className="flex flex-col space-y-8 py-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h2 className="text-2xl font-medium leading-relaxed">
          {t("okayTellMe")} <br />
          <span className="text-[var(--muted-foreground)]">
            {initialPrompts.primary?.text || t("defaultPrompt")}
          </span>
        </h2>
        <Textarea 
          className="min-h-[200px] text-lg leading-relaxed border-none focus-visible:ring-0 p-0 resize-none"
          placeholder={t("placeholder")}
          value={primaryAnswer}
          onChange={(e) => setPrimaryAnswer(e.target.value)}
        />
        <div className="flex justify-end pt-8">
          <Button onClick={handlePrimarySave} size="lg" className="rounded-full">
            {initialPrompts.followUp ? t("continue") : t("saveToLore")}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "followup") {
    return (
      <div className="flex flex-col space-y-8 py-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h2 className="text-2xl font-medium leading-relaxed">
          {t("digDeeper")} <br />
          <span className="text-[var(--muted-foreground)]">
            {initialPrompts.followUp?.text}
          </span>
        </h2>
        <Textarea 
          className="min-h-[150px] text-lg leading-relaxed border-none focus-visible:ring-0 p-0 resize-none"
          placeholder={t("writeNaturally")}
          value={followUpAnswer}
          onChange={(e) => setFollowUpAnswer(e.target.value)}
        />
        <div className="flex items-center justify-end gap-4 pt-8">
          <Button variant="ghost" onClick={handleComplete} className="rounded-full">{t("thatsEnough")}</Button>
          <Button onClick={handleComplete} size="lg" className="rounded-full">{t("saveToLore")}</Button>
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-24 animate-in zoom-in-95 fade-in duration-700">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--muted)] text-4xl">
          ✨
        </div>
        <h2 className="text-3xl font-medium tracking-tight">{t("savedTitle")}</h2>
        <Button variant="outline" size="lg" className="rounded-full mt-8" onClick={() => router.push(`/${locale}`)}>
          {t("backHome")}
        </Button>
      </div>
    )
  }

  return null
}
