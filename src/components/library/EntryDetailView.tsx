"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { ArrowLeft, Edit2, Trash2, Check, X } from "lucide-react"
import { updateEntryAnswers } from "@/app/actions/library"
import { toast } from "sonner"
import { DeleteConfirmDialog } from "./DeleteConfirmDialog"
import { Card, CardContent } from "@/components/ui/Card"

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
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // State for editable answers
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>(
    entry.answers.reduce((acc, ans) => ({ ...acc, [ans.id]: ans.content }), {})
  )

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updates = Object.entries(editedAnswers).map(([id, content]) => ({ id, content }))
      await updateEntryAnswers(updates)
      toast.success("Đã cập nhật entry")
      setIsEditing(false)
      router.refresh()
    } catch (e) {
      toast.error("Lỗi khi cập nhật")
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
        <Button variant="ghost" onClick={() => router.push("/vi/library")} className="px-0 hover:bg-transparent text-[var(--muted-foreground)] hover:text-foreground">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Quay lại thư viện
        </Button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Check className="mr-2 h-4 w-4" />
                Lưu
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Sửa
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteModal(true)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-6xl bg-[var(--muted)] p-4 rounded-3xl">{entry.mood}</span>
        <div>
          <h2 className="text-3xl font-bold">Ngày {entry.localDate.split("-").reverse().join("/")}</h2>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        {entry.answers.map((answer) => (
          <Card key={answer.id} className="border-none shadow-sm bg-[var(--card)]/50 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-medium text-[var(--foreground)]">
                {answer.prompt.text}
              </h3>
              
              {isEditing ? (
                <Textarea 
                  value={editedAnswers[answer.id] || ""}
                  onChange={(e) => setEditedAnswers(prev => ({ ...prev, [answer.id]: e.target.value }))}
                  className="min-h-[150px] text-lg bg-white"
                  placeholder="Nhập câu trả lời của bạn..."
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
    </div>
  )
}
