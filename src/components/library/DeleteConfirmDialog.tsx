"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { deleteJournalEntry } from "@/app/actions/library"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteConfirmDialogProps {
  entryId: string
  isOpen: boolean
  onClose: () => void
}

export function DeleteConfirmDialog({ entryId, isOpen, onClose }: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    try {
      await deleteJournalEntry(entryId)
      toast.success("Đã xóa entry")
      onClose()
      router.push("/vi/library") // Ensure we navigate back to list if deleted from detail page
    } catch (e) {
      toast.error("Lỗi khi xóa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-semibold">Xóa entry này nhé?</h2>
        <p className="text-[var(--muted-foreground)]">
          Những gì bạn viết trong entry này sẽ bị xóa và không thể hoàn tác.
        </p>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button 
            variant="default" 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? "Đang xóa..." : "Đồng ý xóa"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
