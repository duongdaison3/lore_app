import { getYourLore } from "@/app/actions/lore"
import { getTranslations } from "next-intl/server"
import { HideMemoryButton } from "./HideMemoryButton"

export default async function LorePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("Lore")
  
  // Await the data
  const data = await getYourLore(locale)
  const { onThisDay, monthlyLore, highlights } = data

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)]/30 pb-32">
      <div className="max-w-3xl mx-auto px-6 pt-24 space-y-32">
        
        {/* Header */}
        <header className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl sm:text-5xl font-serif text-[var(--foreground)] tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] font-serif max-w-xl leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        {/* On This Day */}
        {onThisDay.length > 0 && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
            <h2 className="text-2xl font-serif text-[var(--foreground)]/80 border-b border-[var(--border)] pb-4">
              {t("onThisDay")}
            </h2>
            <div className="grid gap-8">
              {onThisDay.map((entry, idx) => (
                <div key={idx} className="bg-[var(--card)] p-8 rounded-2xl shadow-sm border border-[var(--border)]/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 text-6xl pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    {entry.mood}
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="text-sm font-medium tracking-widest text-[var(--muted-foreground)] uppercase">
                      {entry.label} • {entry.localDate}
                    </div>
                    {entry.answers.map((ans, aIdx) => (
                      <div key={aIdx} className="space-y-2">
                        <h3 className="text-lg font-serif text-[var(--foreground)]/90">{ans.promptText}</h3>
                        <p className="text-[var(--muted-foreground)] leading-relaxed whitespace-pre-wrap">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Monthly Lore */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
          <h2 className="text-2xl font-serif text-[var(--foreground)]/80 border-b border-[var(--border)] pb-4">
            {t("monthlyLore")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-[var(--accent)]/5 rounded-2xl p-8 space-y-6">
              <h3 className="font-serif text-xl text-[var(--foreground)]">{t("theFacts")}</h3>
              <ul className="space-y-4 text-[var(--muted-foreground)]">
                <li className="flex justify-between">
                  <span>{t("entriesWritten")}</span>
                  <span className="font-medium text-[var(--foreground)]">{monthlyLore.facts.totalEntries}</span>
                </li>
                <li className="flex justify-between">
                  <span>{t("activeDays")}</span>
                  <span className="font-medium text-[var(--foreground)]">{monthlyLore.facts.activeDays}</span>
                </li>
                <li className="space-y-2 pt-2">
                  <span className="block">{t("topMoods")}</span>
                  <div className="flex gap-2 text-2xl">
                    {monthlyLore.facts.moodDistribution.slice(0, 3).map(m => m.mood).join(" ")}
                  </div>
                </li>
              </ul>
            </div>
            
            {monthlyLore.reflection && (
              <div className="bg-[var(--foreground)] text-[var(--background)] rounded-2xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"/></svg>
                </div>
                <h3 className="font-serif text-xl opacity-90 flex items-center gap-2">
                  {t("aiReflection")}
                </h3>
                <p className="font-serif text-lg leading-relaxed opacity-90">
                  {monthlyLore.reflection}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Memory Highlights */}
        <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
          <h2 className="text-2xl font-serif text-[var(--foreground)]/80 border-b border-[var(--border)] pb-4">
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
    <div className="space-y-4">
      <h3 className="font-serif text-xl text-[var(--foreground)]/80">{title}</h3>
      <ul className="space-y-3">
        {memories.map(m => (
          <li key={m.id} className="group flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-[var(--accent)]/5 transition-colors">
            <span className="flex-1 text-[var(--muted-foreground)] leading-relaxed">
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
