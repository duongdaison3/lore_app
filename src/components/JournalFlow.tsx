"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { saveMood, saveDraft, completeEntry, generateContextualFollowUp } from "@/app/actions/journal"
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
  
  const [dynamicFollowUp, setDynamicFollowUp] = useState<Prompt | null>(null)
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
      
      const followUp = await generateContextualFollowUp(primaryAnswer, locale)
      if (followUp) {
        setDynamicFollowUp(followUp)
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
      if (step === "followup" && dynamicFollowUp && followUpAnswer) {
        await saveDraft(entryId, dynamicFollowUp.id, followUpAnswer)
      }
      await completeEntry(entryId)
      setStep("complete")
    } catch {
      toast.error(t("error"))
    }
  }

  if (step === "mood") {
    return (
      <div className="flex flex-col items-center justify-center space-y-16 py-24 animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <h2 className="text-2xl font-serif text-[var(--foreground)]/80 tracking-tight">{t("vibeQuestion")}</h2>
        <div className="grid grid-cols-3 gap-8 sm:grid-cols-6 max-w-2xl">
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => handleMoodSelect(m)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-transparent text-4xl transition-all duration-300 hover:bg-[var(--accent)]/10 hover:shadow-sm opacity-80 hover:opacity-100"
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
      <div className="flex flex-col space-y-12 py-12 animate-in slide-in-from-bottom-2 fade-in duration-1000 w-full max-w-3xl mx-auto px-4">
        <div className="space-y-4">
          <p className="text-lg text-[var(--muted-foreground)]/80">{t("okayTellMe")}</p>
          <h2 className="text-2xl sm:text-3xl font-serif leading-relaxed text-[var(--foreground)]/90">
            {initialPrompts.primary?.text || t("defaultPrompt")}
          </h2>
        </div>
        <div className="relative w-full h-[50vh] sm:h-[40vh]">
          <Textarea 
            className="absolute inset-0 h-full w-full text-xl sm:text-2xl font-serif leading-loose border-none focus-visible:ring-0 p-0 resize-none bg-transparent text-[var(--foreground)]/80 pb-32"
            placeholder={t("placeholder")}
            value={primaryAnswer}
            onChange={(e) => setPrimaryAnswer(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-8 pb-12">
          <Button onClick={handlePrimarySave} variant="default" size="lg" className="rounded-full px-8 font-medium shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-300">
            {t("continue")}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "followup") {
    return (
      <div className="flex flex-col space-y-12 py-12 animate-in slide-in-from-bottom-2 fade-in duration-1000 w-full max-w-3xl mx-auto px-4">
        <div className="space-y-4">
          <p className="text-lg text-[var(--muted-foreground)]/80">{t("digDeeper")}</p>
          <h2 className="text-2xl sm:text-3xl font-serif leading-relaxed text-[var(--foreground)]/90">
            {dynamicFollowUp?.text}
          </h2>
        </div>
        <div className="relative w-full h-[50vh] sm:h-[40vh]">
          <Textarea 
            className="absolute inset-0 h-full w-full text-xl sm:text-2xl font-serif leading-loose border-none focus-visible:ring-0 p-0 resize-none bg-transparent text-[var(--foreground)]/80 pb-32"
            placeholder={t("writeNaturally")}
            value={followUpAnswer}
            onChange={(e) => setFollowUpAnswer(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 pt-8 pb-12">
          <button onClick={handleComplete} className="text-base text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline-offset-4 hover:underline">
            {t("thatsEnough")}
          </button>
          <Button onClick={handleComplete} size="lg" className="rounded-full px-8 font-medium shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-300">
            {t("saveToLore")}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 py-32 animate-in zoom-in-[0.98] fade-in duration-1000">
        <h2 className="text-3xl font-serif tracking-tight text-[var(--foreground)]/90">{t("savedTitle")}</h2>
        <Button variant="ghost" size="lg" className="rounded-full mt-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]" onClick={() => router.push(`/${locale}`)}>
          {t("backHome")}
        </Button>
      </div>
    )
  }

  return null
}
