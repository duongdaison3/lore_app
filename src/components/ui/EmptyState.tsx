import { Sparkles } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
        <Sparkles className="h-6 w-6 text-[var(--muted-foreground)]" />
      </div>
      <div className="space-y-1 text-[var(--muted-foreground)]">
        <p className="text-base font-medium text-[var(--foreground)]">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
      {action && <div className="pt-4">{action}</div>}
    </div>
  )
}
