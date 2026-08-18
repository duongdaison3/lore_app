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
      <div className="flex flex-col items-center justify-center space-y-16 py-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold text-[var(--foreground)] tracking-tight text-center">{t("vibeQuestion")}</h2>
        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] shadow-xl">
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6 max-w-3xl">
            {MOODS.map(m => (
              <button
                key={m}
                onClick={() => handleMoodSelect(m)}
                className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--card)]/40 hover:bg-[var(--card)] border border-[var(--border)]/50 text-5xl transition-all duration-300 hover:shadow-lg hover:-translate-y-2 opacity-90 hover:opacity-100 group"
              >
                <span className="group-hover:scale-110 transition-transform duration-300">{m}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === "primary") {
    return (
      <div className="flex flex-col space-y-8 py-10 animate-in slide-in-from-bottom-4 fade-in duration-1000 w-full max-w-3xl mx-auto px-4 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--primary)]">{t("okayTellMe")}</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold leading-snug text-[var(--foreground)]">
            {initialPrompts.primary?.text || t("defaultPrompt")}
          </h2>
        </div>
        <div className="relative w-full h-[55vh] glass-panel rounded-3xl p-6 sm:p-8 shadow-inner overflow-hidden">
          <Textarea 
            className="absolute inset-0 h-full w-full text-lg sm:text-xl font-sans leading-relaxed border-none focus-visible:ring-0 p-6 sm:p-8 resize-none bg-transparent text-[var(--foreground)] pb-24 placeholder:text-[var(--muted-foreground)]/60"
            placeholder={t("placeholder")}
            value={primaryAnswer}
            onChange={(e) => setPrimaryAnswer(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-4 pb-12">
          <Button onClick={handlePrimarySave} variant="default" size="lg" className="rounded-full px-10 h-14 text-base font-medium shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[var(--primary)] text-[var(--primary-foreground)]">
            {t("continue")}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "followup") {
    return (
      <div className="flex flex-col space-y-8 py-10 animate-in slide-in-from-bottom-4 fade-in duration-1000 w-full max-w-3xl mx-auto px-4 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-widest text-[var(--accent)]">{t("digDeeper")}</p>
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold leading-snug text-[var(--foreground)]">
            {dynamicFollowUp?.text}
          </h2>
        </div>
        <div className="relative w-full h-[55vh] glass-panel rounded-3xl p-6 sm:p-8 shadow-inner overflow-hidden">
          <Textarea 
            className="absolute inset-0 h-full w-full text-lg sm:text-xl font-sans leading-relaxed border-none focus-visible:ring-0 p-6 sm:p-8 resize-none bg-transparent text-[var(--foreground)] pb-24 placeholder:text-[var(--muted-foreground)]/60"
            placeholder={t("writeNaturally")}
            value={followUpAnswer}
            onChange={(e) => setFollowUpAnswer(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 pb-12">
          <button onClick={handleComplete} className="text-base font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors underline-offset-4 hover:underline">
            {t("thatsEnough")}
          </button>
          <Button onClick={handleComplete} variant="default" size="lg" className="rounded-full px-10 h-14 text-base font-medium shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[var(--primary)] text-[var(--primary-foreground)]">
            {t("saveToLore")}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "complete") {
    return (
      <div className="flex flex-col items-center justify-center space-y-10 py-32 animate-in zoom-in-[0.98] fade-in duration-1000">
        <div className="w-24 h-24 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-4xl font-heading font-semibold tracking-tight text-[var(--foreground)] text-center">{t("savedTitle")}</h2>
        <Button variant="outline" size="lg" className="rounded-full px-10 h-14 text-base font-medium shadow-sm hover:shadow-md border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)]" onClick={() => router.push(`/${locale}`)}>
          {t("backHome")}
        </Button>
      </div>
    )
  }

  return null
}
