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
    <Link href={`/${locale}/library/${id}`} className="block transition-transform hover:-translate-y-1">
      <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-3xl bg-[var(--muted)] p-2 rounded-xl">{mood}</span>
            <span className="text-sm text-[var(--muted-foreground)]">{date}</span>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-lg leading-snug line-clamp-2">
              {prompt}
            </h4>
            <p className="text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
              {answerPreview || <span className="italic">{t("noAnswer")}</span>}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
