import { getJournalEntryById } from "@/app/actions/library"
import { EntryDetailView } from "@/components/library/EntryDetailView"
import { notFound } from "next/navigation"

interface EntryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EntryPage({ params }: EntryPageProps) {
  const resolvedParams = await params
  const entry = await getJournalEntryById(resolvedParams.id)

  if (!entry) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <EntryDetailView entry={entry} />
    </div>
  )
}
