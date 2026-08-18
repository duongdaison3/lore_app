"use client"

import { useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { deleteMemory, clearAllMemories, togglePersonalization, deleteAccount } from "@/app/actions/privacy"
import { logoutAction } from "@/app/actions/auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/Button"

type Memory = {
  id: string
  content: string
  confidence: number
  sourceEntry?: { localDate: string } | null
}

export function PrivacyCenter({ 
  memories, 
  initialPersonalization 
}: { 
  memories: Memory[], 
  initialPersonalization: boolean 
}) {
  const t = useTranslations("Privacy")
  const [isPending, startTransition] = useTransition()
  const [personalization, setPersonalization] = useState(initialPersonalization)

  const handleTogglePersonalization = (enabled: boolean) => {
    setPersonalization(enabled)
    startTransition(async () => {
      try {
        await togglePersonalization(enabled)
        toast.success(t("success"))
      } catch (e) {
        toast.error(t("error"))
        setPersonalization(!enabled)
      }
    })
  }

  const handleDeleteMemory = (id: string) => {
    startTransition(async () => {
      try {
        await deleteMemory(id)
        toast.success(t("success"))
      } catch (e) {
        toast.error(t("error"))
      }
    })
  }

  const handleClearAll = () => {
    if (!window.confirm(t("clearAllConfirm"))) return
    startTransition(async () => {
      try {
        await clearAllMemories()
        toast.success(t("success"))
      } catch (e) {
        toast.error(t("error"))
      }
    })
  }

  const handleDeleteAccount = () => {
    if (!window.confirm(t("deleteAccountConfirm"))) return
    startTransition(async () => {
      try {
        await deleteAccount()
        // Force client side redirect/logout
        window.location.href = "/" 
      } catch (e) {
        toast.error(t("error"))
      }
    })
  }

  const getConfidenceText = (conf: number) => {
    if (conf >= 0.8) return t("confidenceHigh")
    if (conf >= 0.5) return t("confidenceMedium")
    return t("confidenceLow")
  }

  return (
    <section className="space-y-6 pt-16 border-t border-[var(--border)]">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif text-[var(--foreground)]">{t("title")}</h2>
        <p className="text-[var(--muted-foreground)] leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-8">
        
        {/* Personalization Toggle */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
          <div className="space-y-1">
            <label className="font-medium text-[var(--foreground)]">{t("aiPersonalization")}</label>
            <p className="text-sm text-[var(--muted-foreground)]">{t("aiPersonalizationDesc")}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={personalization}
              onChange={(e) => handleTogglePersonalization(e.target.checked)}
              disabled={isPending}
            />
            <div className="w-11 h-6 bg-[var(--muted)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--foreground)]"></div>
          </label>
        </div>

        {/* Memory Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[var(--foreground)]">{t("memories")}</h3>
            {memories.length > 0 && (
              <button 
                onClick={handleClearAll}
                disabled={isPending}
                className="text-sm text-red-500 hover:text-red-400 transition-colors"
              >
                {t("clearAll")}
              </button>
            )}
          </div>
          
          {memories.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)] italic">{t("noMemories")}</p>
          ) : (
            <ul className="space-y-3">
              {memories.map(m => (
                <li key={m.id} className="flex justify-between items-start gap-4 p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] group">
                  <div className="space-y-1">
                    <p className="text-[var(--foreground)] leading-relaxed">{m.content}</p>
                    <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-2">
                      <span>{getConfidenceText(m.confidence)}</span>
                      {m.sourceEntry && (
                        <>
                          <span>•</span>
                          <span>{t("sourceDate", { date: m.sourceEntry.localDate })}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteMemory(m.id)}
                    disabled={isPending}
                    className="text-xs text-[var(--muted-foreground)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  >
                    {t("deleteMemory")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="font-medium text-[var(--foreground)]">{t("exportData")}</label>
              <p className="text-sm text-[var(--muted-foreground)]">{t("exportDesc")}</p>
            </div>
            <a href="/api/export" download>
              <Button variant="outline" size="sm">{t("exportData")}</Button>
            </a>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-1">
              <label className="font-medium text-red-500">{t("deleteAccount")}</label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="text-red-500 border-red-500/20 hover:bg-red-500/10 hover:text-red-500"
            >
              {t("deleteAccount")}
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
