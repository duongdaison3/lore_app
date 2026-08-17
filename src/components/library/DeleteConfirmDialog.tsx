"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { deleteJournalEntry } from "@/app/actions/library"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteConfirmDialogProps {
  entryId: string
  isOpen: boolean
  onClose: () => void
  onDeleteSuccess?: () => void
}

export function DeleteConfirmDialog({ entryId, isOpen, onClose, onDeleteSuccess }: DeleteConfirmDialogProps) {
  const t = useTranslations("Library")
  const tc = useTranslations("Common")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteJournalEntry(entryId)
      toast.success(t("deletedSuccess"))
      onClose()
      onDeleteSuccess?.()
    } catch (e) {
      toast.error(t("deleteError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => !loading && onClose()}>
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">{t("deleteTitle")}</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          {t("deleteDesc")}
        </p>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {tc("cancel")}
          </Button>
          <Button 
            variant="default" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? tc("deleting") : tc("confirmDelete")}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
