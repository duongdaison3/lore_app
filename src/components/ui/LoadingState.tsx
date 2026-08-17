import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function LoadingState({ message }: { message?: string }) {
  const t = useTranslations("Common")
  const displayMessage = message || t("loading")
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-[var(--muted-foreground)]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      <p className="text-sm">{displayMessage}</p>
    </div>
  )
}
