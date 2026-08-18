"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations, useFormatter, useLocale } from "next-intl"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { updateEntryAnswers } from "@/app/actions/library"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { QuoteGeneratorModal } from "./QuoteGeneratorModal"
import { Card, CardContent } from "@/components/ui/Card"
import { Share2, ArrowLeft, Edit2, Trash2, Check, X } from "lucide-react"

// Assuming the types based on Prisma schema
type AnswerType = {
  id: string
  content: string
  prompt: {
    text: string
    isFollowUp: boolean
  }
}

type EntryType = {
  id: string
  localDate: string
  mood: string
  answers: AnswerType[]
}

export function EntryDetailView({ entry }: { entry: EntryType }) {
  const router = useRouter()
  const t = useTranslations("Library")
  const tc = useTranslations("Common")
  const format = useFormatter()
  const locale = useLocale()
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // State for quote generator
  const [quoteModalData, setQuoteModalData] = useState<{ isOpen: boolean; text: string; date: string; mood: string }>({
    isOpen: false,
    text: "",
    date: "",
    mood: ""
  })
  
  // State for editable answers
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>(
    entry.answers.reduce((acc, ans) => ({ ...acc, [ans.id]: ans.content }), {})
  )

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates = Object.entries(editedAnswers).map(([id, content]) => ({ id, content }))
      await updateEntryAnswers(updates)
      toast.success(t("updateSuccess"))
      setIsEditing(false)
      router.refresh()
    } catch (e) {
      toast.error(t("updateError"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    // Revert
    setEditedAnswers(
      entry.answers.reduce((acc, ans) => ({ ...acc, [ans.id]: ans.content }), {})
    )
    setIsEditing(false)
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push(`/${locale}/library`)} className="px-0 hover:bg-transparent text-[var(--muted-foreground)] hover:text-foreground">
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t("backToLibrary")}
        </Button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                {tc("cancel")}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Check className="mr-2 h-4 w-4" />
                {tc("save")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                {tc("edit")}
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteModal(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                {tc("delete")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-6xl bg-[var(--muted)] p-4 rounded-3xl">{entry.mood}</span>
        <div>
          <h2 className="text-3xl font-bold">{t("day")} {format.dateTime(new Date(entry.localDate), { dateStyle: 'short' })}</h2>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        {entry.answers.map((answer) => (
          <Card key={answer.id} className="border-none shadow-sm bg-[var(--card)]/50 backdrop-blur group/card">
            <CardContent className="p-6 space-y-4 relative">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-medium text-[var(--foreground)]">
                  {answer.prompt.text}
                </h3>
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover/card:opacity-100 transition-opacity -mt-2 -mr-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] shrink-0"
                    onClick={() => setQuoteModalData({
                      isOpen: true,
                      text: answer.content,
                      date: format.dateTime(new Date(entry.localDate), { dateStyle: 'short' }),
                      mood: entry.mood
                    })}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <Textarea 
                  value={editedAnswers[answer.id] || ""}
                  onChange={(e) => setEditedAnswers(prev => ({ ...prev, [answer.id]: e.target.value }))}
                  className="min-h-[150px] text-lg bg-[var(--background)]"
                />
              ) : (
                <p className="text-lg leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
                  {answer.content}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteConfirmDialog 
        entryId={entry.id} 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />

      <QuoteGeneratorModal
        isOpen={quoteModalData.isOpen}
        onClose={() => setQuoteModalData(prev => ({ ...prev, isOpen: false }))}
        quoteText={quoteModalData.text}
        date={quoteModalData.date}
        mood={quoteModalData.mood}
      />
    </div>
  )
}
