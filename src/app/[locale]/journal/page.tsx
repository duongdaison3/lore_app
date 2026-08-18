import { getPrompts } from "@/app/actions/journal"
import { JournalFlow } from "@/components/JournalFlow"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"

export default async function JournalPage() {
  const t = await getTranslations("Journal")
  const session = await auth()
  if (!session) {
    redirect("/vi/login")
  }

  let prompts
  try {
    prompts = await getPrompts()
  } catch {
    // Fallback if DB not seeded or other error
    prompts = {
      primary: [{ id: "p1", text: t("fallbackPrimary"), isFollowUp: false }],
      followUp: { id: "f1", text: t("fallbackFollowUp"), isFollowUp: true }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <JournalFlow initialPrompts={prompts as any} />
    </div>
  )
}
