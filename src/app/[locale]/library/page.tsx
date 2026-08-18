import { getJournalEntries } from "@/app/actions/library"
import { EntryCard } from "@/components/library/EntryCard"
import { LibraryFilters } from "@/components/library/LibraryFilters"
import { EmptyState } from "@/components/ui/EmptyState"
import { getTranslations } from "next-intl/server"

export default async function LibraryPage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ q?: string, mood?: string, date?: string }> }) {
  const t = await getTranslations("Library")
  const searchParams = await searchParamsPromise;
  
  const { entries, total } = await getJournalEntries({
    q: searchParams.q,
    mood: searchParams.mood,
    date: searchParams.date
  })

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <h1 className="text-4xl md:text-5xl font-heading font-bold mb-10 tracking-tight text-[var(--foreground)] text-center sm:text-left">{t("libraryTitle")}</h1>
      
      <LibraryFilters />

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const firstAnswer = entry.answers[0]
            const promptText = firstAnswer?.prompt?.text || t("noPrompt")
            const contentPreview = firstAnswer?.content || ""
            
            return (
              <EntryCard
                key={entry.id}
                id={entry.id}
                date={entry.localDate}
                mood={entry.mood}
                prompt={promptText}
                answerPreview={contentPreview}
              />
            )
          })}
        </div>
      ) : (
        <div className="mt-20">
          <EmptyState 
            title={searchParams.date ? t("emptyDate") : t("emptyLibrary")}
            description={t("emptyDesc")}
          />
        </div>
      )}
    </div>
  )
}
