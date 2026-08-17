"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { saveMood, getPrompts, saveDraft, completeEntry } from "@/app/actions/journal"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "sonner"

const MOODS = ["😵‍💫", "😐", "🙂", "🥰", "🔥", "🫠"]

interface Prompt {
  id: string
  text: string
  isFollowUp: boolean
}

export function JournalFlow({ initialPrompts }: { initialPrompts: { primary: Prompt | null, followUp: Prompt | null } }) {
  const t = useTranslations("Journal")
  const [step, setStep] = useState<"mood" | "primary" | "followup" | "complete">("mood")
  const [mood, setMood] = useState("")
  const [entryId, setEntryId] = useState<string | null>(null)
  
  const [primaryAnswer, setPrimaryAnswer] = useState("")
  const [followUpAnswer, setFollowUpAnswer] = useState("")

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood)
    try {
      const offset = new Date().getTimezoneOffset()
      const { entryId } = await saveMood(selectedMood, offset)
      setEntryId(entryId)
      setStep("primary")
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      toast.error(t("error"))
    }
  }

  if (step === "mood") {
    return (
      <div className="flex flex-col items-center justify-center space-y-12 py-16 animate-in fade-in duration-700">
        <h2 className="text-3xl font-medium tracking-tight">Hôm nay bạn đang ở vibe nào?</h2>
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
          Okay, kể tôi nghe một chút. <br />
          <span className="text-[var(--muted-foreground)]">
            {initialPrompts.primary?.text || "Có điều gì đáng nhớ hôm nay không?"}
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
            {initialPrompts.followUp ? "Tiếp tục" : "Lưu vào Lore"}
          </Button>
        </div>
      </div>
    )
  }

  if (step === "followup") {
    return (
      <div className="flex flex-col space-y-8 py-12 animate-in slide-in-from-bottom-4 fade-in duration-500">
        <h2 className="text-2xl font-medium leading-relaxed">
          Đào sâu thêm một chút? <br />
          <span className="text-[var(--muted-foreground)]">
            {initialPrompts.followUp?.text}
          </span>
        </h2>
        <Textarea 
          className="min-h-[150px] text-lg leading-relaxed border-none focus-visible:ring-0 p-0 resize-none"
          placeholder="Cứ viết tự nhiên..."
          value={followUpAnswer}
          onChange={(e) => setFollowUpAnswer(e.target.value)}
        />
        <div className="flex items-center justify-end gap-4 pt-8">
          <Button variant="ghost" onClick={handleComplete} className="rounded-full">Thôi, vậy đủ rồi</Button>
          <Button onClick={handleComplete} size="lg" className="rounded-full">Lưu vào Lore</Button>
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
        <h2 className="text-3xl font-medium tracking-tight">Đã lưu vào Lore</h2>
        <Button variant="outline" size="lg" className="rounded-full mt-8" onClick={() => window.location.href = "/vi"}>
          Quay lại trang chủ
        </Button>
      </div>
    )
  }

  return null
}
