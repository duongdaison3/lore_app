import { getPrompts } from "@/app/actions/journal"
import { JournalFlow } from "@/components/JournalFlow"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function JournalPage() {
  const session = await auth()
  if (!session) {
    redirect("/vi/login")
  }

  let prompts
  try {
    prompts = await getPrompts()
  } catch (e) {
    // Fallback if DB not seeded or other error
    prompts = {
      primary: { id: "p1", text: "Nếu hôm nay là một tập phim, bạn sẽ đặt tên nó là gì?", isFollowUp: false },
      followUp: { id: "f1", text: "Điều gì đã khiến bạn quyết định như vậy?", isFollowUp: true }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <JournalFlow initialPrompts={prompts as any} />
    </div>
  )
}
