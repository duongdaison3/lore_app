import { Loader2 } from "lucide-react"

export function LoadingState({ message = "Đang tải..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-[var(--muted-foreground)]">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
