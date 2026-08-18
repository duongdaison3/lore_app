import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import { Card, CardContent } from "@/components/ui/Card"

interface EntryCardProps {
  id: string
  date: string
  mood: string
  prompt: string
  answerPreview: string
}

export function EntryCard({ id, date, mood, prompt, answerPreview }: EntryCardProps) {
  const t = useTranslations("Library")
  const locale = useLocale()

  return (
    <Link href={`/${locale}/library/${id}`} className="block group">
      <div className="h-full glass-panel rounded-3xl p-6 flex flex-col space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[var(--primary)]/30 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] text-8xl pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
          {mood}
        </div>
        <div className="flex items-center justify-between relative z-10">
          <span className="text-3xl drop-shadow-sm">{mood}</span>
          <span className="text-xs font-bold tracking-widest text-[var(--muted-foreground)] uppercase bg-[var(--muted)]/50 px-3 py-1 rounded-full">{date}</span>
        </div>
        
        <div className="space-y-3 relative z-10 flex-1">
          <h4 className="font-heading font-medium text-xl leading-snug line-clamp-2 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            {prompt}
          </h4>
          <p className="text-[var(--muted-foreground)] line-clamp-3 leading-relaxed text-sm md:text-base">
            {answerPreview || <span className="italic">{t("noAnswer")}</span>}
          </p>
        </div>
      </div>
    </Link>
  )
}
