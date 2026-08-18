"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { EntryCard } from "@/components/library/EntryCard"

export function DashboardBentoGrid({ 
  data, 
  locale 
}: { 
  data: any
  locale: string 
}) {
  const t = useTranslations("Dashboard")
  const tj = useTranslations("Journal")
  const tl = useTranslations("Library")

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Hero Section */}
      <div className="w-full flex justify-center">
        <Link href={`/${locale}/journal`} className="w-full sm:w-2/3 group">
          <div className="w-full px-8 py-8 md:py-10 rounded-[2.5rem] glass-panel shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-[var(--primary)]/5 to-[var(--accent)]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <span className="text-2xl font-heading font-medium text-[var(--foreground)]">
                {tj('newEntry')}
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Recap Banner */}
      <div className="w-full">
        <Link href={`/${locale}/recap`} className="block group">
          <div className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">✨</span>
              <div>
                <h3 className="font-heading font-bold text-lg leading-tight">Lore Recap</h3>
                <p className="text-sm opacity-90 font-medium">Nhìn lại hành trình viết nhật ký của bạn</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col: Recent Entries */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-heading font-semibold text-xl text-[var(--foreground)]">{t("recentEntries")}</h2>
            <Link href={`/${locale}/library`} className="text-sm font-medium text-[var(--primary)] hover:underline">
              {t("viewAll")}
            </Link>
          </div>
          
          {data.recentEntries.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {data.recentEntries.map((entry: any) => {
                const firstAnswer = entry.answers[0]
                return (
                  <EntryCard
                    key={entry.id}
                    id={entry.id}
                    date={entry.localDate}
                    mood={entry.mood}
                    prompt={firstAnswer?.prompt?.text || tl("noPrompt")}
                    answerPreview={firstAnswer?.content || ""}
                  />
                )
              })}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 text-center text-[var(--muted-foreground)]">
              {t("noRecent")}
            </div>
          )}
        </div>

        {/* Right Col: Stats & Streak */}
        <div className="space-y-6">
          
          {/* Streak Widget */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none text-8xl">
              🔥
            </div>
            <div className="relative z-10 space-y-2">
              <h3 className="font-heading font-medium text-[var(--muted-foreground)]">{t("streak")}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-heading font-bold text-[var(--foreground)]">{data.streak}</span>
                <span className="text-[var(--muted-foreground)] font-medium">{t("days")}</span>
              </div>
              <p className="text-sm text-[var(--primary)] font-medium pt-2">{t("streakDesc")}</p>
            </div>
          </div>

          {/* Monthly Stats Widget */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative z-10 space-y-4">
              <h3 className="font-heading font-medium text-[var(--muted-foreground)]">{t("monthlyStats")}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <span className="block text-3xl font-heading font-bold text-[var(--foreground)]">{data.monthlyStats.totalEntries}</span>
                  <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{t("entries")}</span>
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-heading font-bold text-[var(--foreground)]">{data.monthlyStats.activeDays}</span>
                  <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{t("activeDays")}</span>
                </div>
              </div>
              {data.monthlyStats.moodDistribution.length > 0 && (
                <div className="pt-3 border-t border-[var(--border)]/50 flex gap-2 text-2xl">
                  {data.monthlyStats.moodDistribution.slice(0, 4).map((m: any) => m.mood).join(" ")}
                </div>
              )}
            </div>
          </div>

          {/* On This Day Widget */}
          {data.onThisDay && (
            <Link href={`/${locale}/lore`} className="block">
              <div className="bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--primary-foreground)] rounded-3xl p-6 relative overflow-hidden group shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <div className="relative z-10 space-y-3">
                  <div className="inline-block px-2 py-1 rounded-full bg-white/20 text-xs font-bold tracking-widest uppercase">
                    {t("onThisDay")}
                  </div>
                  <p className="font-heading font-medium text-lg leading-snug">
                    {data.onThisDay.answers[0]?.promptText || "Kỷ niệm của bạn"}
                  </p>
                  <p className="text-sm opacity-90 line-clamp-2">
                    {data.onThisDay.answers[0]?.content}
                  </p>
                </div>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  )
}
