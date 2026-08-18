"use client"

import { hideMemory } from "@/app/actions/lore"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useTransition } from "react"

export function HideMemoryButton({ memoryId }: { memoryId: string }) {
  const t = useTranslations("Lore")
  const [isPending, startTransition] = useTransition()

  return (
    <button 
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await hideMemory(memoryId)
            toast.success(t("hiddenSuccess"))
          } catch {
            toast.error("Error hiding memory")
          }
        })
      }}
      className="text-xs px-2 py-1 rounded text-[var(--muted-foreground)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)] transition-colors disabled:opacity-50"
      title={t("hideTitle")}
    >
      ×
    </button>
  )
}
