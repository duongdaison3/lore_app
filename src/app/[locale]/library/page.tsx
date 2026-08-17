import { getJournalEntries } from "@/app/actions/library"
import { EntryCard } from "@/components/library/EntryCard"
import { LibraryFilters } from "@/components/library/LibraryFilters"
import { EmptyState } from "@/components/ui/EmptyState"

interface LibraryPageProps {
  searchParams: {
    q?: string
    mood?: string
    date?: string
  }
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const { entries, total } = await getJournalEntries({
    q: searchParams.q,
    mood: searchParams.mood,
    date: searchParams.date
  })

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-4xl font-bold mb-8">Thư viện Lore</h1>
      
      <LibraryFilters />

      {entries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => {
            const firstAnswer = entry.answers[0]
            const promptText = firstAnswer?.prompt?.text || "Không có câu hỏi"
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
            title={searchParams.date ? "Ngày hôm nay vẫn còn trống." : "Chưa có lore nào ở đây."}
            description="Hãy viết entry đầu tiên hoặc thử thay đổi bộ lọc tìm kiếm nhé."
          />
        </div>
      )}
    </div>
  )
}
