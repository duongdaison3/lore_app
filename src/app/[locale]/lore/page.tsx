import { getYourLore } from "@/app/actions/lore"
import { getTranslations } from "next-intl/server"
import { HideMemoryButton } from "./HideMemoryButton"

export default async function LorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("Lore")
  
  // Await the data
  const data = await getYourLore(locale)
  const { onThisDay, monthlyLore, highlights } = data

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)]/30 pb-32">
      <div className="max-w-3xl mx-auto px-6 pt-24 space-y-32">
        
        {/* Header */}
        <header className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-[var(--foreground)] tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted-foreground)] font-sans max-w-xl leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* On This Day */}
        {onThisDay.length > 0 && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
            <h2 className="text-2xl font-heading font-semibold text-[var(--foreground)] border-b border-[var(--border)]/50 pb-4">
              {t("onThisDay")}
            </h2>
            <div className="grid gap-8">
              {onThisDay.map((entry, idx) => (
                <div key={idx} className="glass-panel p-8 md:p-10 rounded-3xl shadow-md relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] text-8xl pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700">
                    {entry.mood}
                  </div>
                  <div className="space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold tracking-widest uppercase">
                      <span>{entry.label}</span>
                      <span className="w-1 h-1 rounded-full bg-[var(--primary)]/50" />
                      <span>{entry.localDate}</span>
                    </div>
                    {entry.answers.map((ans, aIdx) => (
                      <div key={aIdx} className="space-y-3">
                        <h3 className="text-xl font-heading font-medium text-[var(--foreground)]">{ans.promptText}</h3>
                        <p className="text-[var(--muted-foreground)] text-lg leading-relaxed whitespace-pre-wrap">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Monthly Lore */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
          <h2 className="text-2xl font-heading font-semibold text-[var(--foreground)] border-b border-[var(--border)]/50 pb-4">
            {t("monthlyLore")}
          </h2>
          <div className="grid sm:grid-cols-5 gap-6">
            <div className="sm:col-span-2 glass-panel rounded-3xl p-8 space-y-6 shadow-sm border-[var(--border)]/30">
              <h3 className="font-heading font-medium text-xl text-[var(--foreground)]">{t("theFacts")}</h3>
              <ul className="space-y-5 text-[var(--muted-foreground)]">
                <li className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider">{t("entriesWritten")}</span>
                  <span className="font-heading font-semibold text-2xl text-[var(--foreground)]">{monthlyLore.facts.totalEntries}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm uppercase tracking-wider">{t("activeDays")}</span>
                  <span className="font-heading font-semibold text-2xl text-[var(--foreground)]">{monthlyLore.facts.activeDays}</span>
                </li>
                <li className="space-y-3 pt-2">
                  <span className="block text-sm uppercase tracking-wider">{t("topMoods")}</span>
                  <div className="flex gap-3 text-3xl">
                    {monthlyLore.facts.moodDistribution.slice(0, 3).map(m => m.mood).join(" ")}
                  </div>
                </li>
              </ul>
            </div>
            
            {monthlyLore.reflection && (
              <div className="sm:col-span-3 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] rounded-3xl p-8 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v18M3 12h18"/></svg>
                </div>
                <div className="relative z-10 space-y-6">
                  <h3 className="font-heading font-semibold text-xl tracking-wide flex items-center gap-2">
                    {t("aiReflection")}
                  </h3>
                  <p className="font-sans text-lg md:text-xl leading-relaxed text-[var(--primary-foreground)]/90">
                    {monthlyLore.reflection}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Memory Highlights */}
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-500 fill-mode-both">
          <h2 className="text-2xl font-heading font-semibold text-[var(--foreground)] border-b border-[var(--border)]/50 pb-4">
            {t("highlights")}
          </h2>
          
          <div className="grid gap-12 sm:grid-cols-2">
            <MemoryGroup title={t("tinyWins")} memories={highlights.tinyWins} />
            <MemoryGroup title={t("plotTwists")} memories={highlights.plotTwists} />
            <MemoryGroup title={t("themes")} memories={highlights.themes} />
            <MemoryGroup title={t("people")} memories={highlights.people} />
            <MemoryGroup title={t("milestones")} memories={highlights.milestones} />
          </div>
        </section>

      </div>
    </div>
  )
}

function MemoryGroup({ title, memories }: { title: string, memories: any[] }) {
  if (memories.length === 0) return null;
  return (
    <div className="space-y-5">
      <h3 className="font-heading font-medium text-lg tracking-wide text-[var(--foreground)]/90 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
        {title}
      </h3>
      <ul className="space-y-3">
        {memories.map(m => (
          <li key={m.id} className="group flex items-start gap-3 p-4 rounded-2xl glass-panel hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <span className="flex-1 text-[var(--muted-foreground)] leading-relaxed group-hover:text-[var(--foreground)] transition-colors">
              {m.content}
            </span>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <HideMemoryButton memoryId={m.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
