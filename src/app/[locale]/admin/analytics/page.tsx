import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

// Force dynamic since analytics update frequently
export const dynamic = "force-dynamic"

export default async function AnalyticsDashboardPage() {
  const t = await getTranslations("Analytics")

  // For real production we might restrict this by admin role.
  // We'll leave it accessible per user requirement for local dev visibility.

  // Fetch all product events
  const productEvents = await prisma.telemetryEvent.findMany({
    where: { type: "PRODUCT" },
    orderBy: { createdAt: "desc" }
  })

  const aiEvents = await prisma.telemetryEvent.findMany({
    where: { type: "AI" },
    orderBy: { createdAt: "desc" }
  })

  // 1. DAU: distinct distinctIds per day (rough calculation in memory for demo)
  const dauSet = new Set(productEvents.map((e: any) => e.distinctId))
  const totalUsers = dauSet.size

  // 2. Completion Funnel
  const journalStarted = productEvents.filter((e: any) => e.name === "mood_selected").length
  const journalCompleted = productEvents.filter((e: any) => e.name === "journal_completed").length
  const completionRate = journalStarted > 0 ? ((journalCompleted / journalStarted) * 100).toFixed(1) : "0"

  // 3. AI Health Metrics
  const aiGenerations = aiEvents.filter((e: any) => e.name === "ai_generation")
  const aiSuccessCount = aiGenerations.filter((e: any) => {
    const meta = e.metadata as any
    return meta?.success === true
  }).length
  const aiFallbackCount = aiGenerations.filter((e: any) => {
    const meta = e.metadata as any
    return meta?.fallback === true
  }).length
  
  const aiSuccessRate = aiGenerations.length > 0 ? ((aiSuccessCount / aiGenerations.length) * 100).toFixed(1) : "0"
  
  // Average Latency
  let totalLatency = 0;
  let latencyCount = 0;
  aiGenerations.forEach((e: any) => {
    const meta = e.metadata as any
    if (meta?.latencyMs) {
      totalLatency += meta.latencyMs;
      latencyCount++;
    }
  })
  const avgLatency = latencyCount > 0 ? (totalLatency / latencyCount).toFixed(0) : "0"

  // 4. Prompt Health Framework
  const promptViewed = productEvents.filter((e: any) => e.name === "prompt_viewed").length
  const promptChanged = productEvents.filter((e: any) => e.name === "prompt_changed").length
  const rerollRate = promptViewed > 0 ? ((promptChanged / promptViewed) * 100).toFixed(1) : "0"

  const followupOffered = productEvents.filter((e: any) => e.name === "followup_offered").length
  const followupAccepted = productEvents.filter((e: any) => e.name === "followup_accepted").length
  const followupRate = followupOffered > 0 ? ((followupAccepted / followupOffered) * 100).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-[var(--background)] p-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div>
          <h1 className="text-3xl font-serif text-[var(--foreground)] tracking-tight">Developer Analytics</h1>
          <p className="text-[var(--muted-foreground)] mt-2">Privacy-conscious observability without exposing raw user content.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* USER RETENTION */}
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Active Users</h3>
            <p className="text-4xl font-light text-[var(--foreground)] mt-4">{totalUsers}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">Distinct IDs stored (Pseudonymous)</p>
          </div>

          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Completion Rate</h3>
            <p className="text-4xl font-light text-[var(--foreground)] mt-4">{completionRate}%</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">{journalCompleted} completed / {journalStarted} started</p>
          </div>
          
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Prompt Reroll Rate</h3>
            <p className="text-4xl font-light text-[var(--foreground)] mt-4">{rerollRate}%</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-2">{promptChanged} rerolled / {promptViewed} viewed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI HEALTH */}
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--foreground)] border-b border-[var(--border)] pb-4 mb-4">AI Engine Health</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Generation Success Rate</span>
                <span className="font-medium text-[var(--foreground)]">{aiSuccessRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Fallback Frequency</span>
                <span className="font-medium text-[var(--foreground)]">{aiFallbackCount} times</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Average Latency</span>
                <span className="font-medium text-[var(--foreground)]">{avgLatency} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--muted-foreground)]">Follow-up Acceptance</span>
                <span className="font-medium text-[var(--foreground)]">{followupRate}%</span>
              </div>
            </div>
          </div>

          {/* EVENT LOG */}
          <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
            <h3 className="text-sm font-medium text-[var(--foreground)] border-b border-[var(--border)] pb-4 mb-4">Recent Events Log</h3>
            
            <div className="space-y-3 h-64 overflow-y-auto pr-2">
              {[...productEvents, ...aiEvents].sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 50).map((e: any) => (
                <div key={e.id} className="text-sm flex flex-col p-2 bg-[var(--background)] rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-[var(--foreground)]">{e.name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">{e.createdAt.toLocaleTimeString()}</span>
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)] font-mono mt-1 break-all">
                    {JSON.stringify(e.metadata)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
