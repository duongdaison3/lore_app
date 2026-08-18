"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ArrowRight } from "lucide-react"

interface RecapData {
  totalEntries: number
  firstEntryDate: string
  mostFrequentMood: string
  totalWords: number
  longestStreak: number
  memories: string[]
}

interface RecapStoryProps {
  data: RecapData
  t: Record<string, string>
}

export function RecapStory({ data, t }: RecapStoryProps) {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle scroll snapping detection
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollY = containerRef.current.scrollTop
      const height = window.innerHeight
      const index = Math.round(scrollY / height)
      if (index !== currentSlide) {
        setCurrentSlide(index)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [currentSlide])

  const scrollToNext = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
  }

  const slides = [
    // Slide 1: Welcome
    (
      <div key="slide1" className="h-screen w-full flex flex-col items-center justify-center snap-center relative bg-gradient-to-b from-[var(--background)] to-[var(--primary)]/10">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-96 h-96 bg-[var(--primary)] rounded-full blur-[100px]"></div>
        </div>
        <div className={`transition-all duration-1000 transform ${currentSlide === 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-center tracking-tight mb-6">
            {t.welcome}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--muted-foreground)] text-center max-w-lg mx-auto">
            {t.welcomeSub}
          </p>
        </div>
        <button onClick={scrollToNext} className="absolute bottom-12 animate-bounce p-4 rounded-full bg-[var(--foreground)]/5 text-[var(--foreground)]">
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    ),
    // Slide 2: Stats
    (
      <div key="slide2" className="h-screen w-full flex flex-col items-center justify-center snap-center relative bg-[var(--background)] px-6">
        <h2 className={`text-4xl md:text-5xl font-heading font-bold mb-16 text-center transition-all duration-1000 delay-100 transform ${currentSlide === 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {t.statsTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className={`glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-1000 delay-200 transform ${currentSlide === 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-6xl font-bold text-[var(--primary)] mb-2">{data.totalEntries}</span>
            <span className="text-lg font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{t.totalDays}</span>
          </div>
          <div className={`glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-1000 delay-300 transform ${currentSlide === 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-6xl font-bold text-[var(--accent)] mb-2">{data.totalWords}</span>
            <span className="text-lg font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{t.wordsWritten}</span>
          </div>
          <div className={`glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-1000 delay-400 transform ${currentSlide === 1 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="text-6xl font-bold text-green-500 mb-2">{data.longestStreak}</span>
            <span className="text-lg font-medium text-[var(--muted-foreground)] uppercase tracking-wider">{t.longestStreak}</span>
          </div>
        </div>
      </div>
    ),
    // Slide 3: Mood
    (
      <div key="slide3" className="h-screen w-full flex flex-col items-center justify-center snap-center relative bg-gradient-to-t from-[var(--background)] to-[var(--accent)]/10 px-6">
        <div className={`transition-all duration-1000 transform ${currentSlide === 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="text-[150px] md:text-[200px] leading-none text-center drop-shadow-2xl mb-8 animate-pulse">
            {data.mostFrequentMood || "😐"}
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-center mb-4">
            {t.moodTitle}
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] text-center">
            {t.moodDesc}
          </p>
        </div>
      </div>
    ),
    // Slide 4: Memories
    (
      <div key="slide4" className="h-screen w-full flex flex-col items-center justify-center snap-center relative bg-[var(--background)] px-6">
        <h2 className={`text-3xl md:text-5xl font-heading font-bold mb-4 text-center transition-all duration-1000 transform ${currentSlide === 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {t.memoriesTitle}
        </h2>
        <p className={`text-xl text-[var(--muted-foreground)] text-center mb-12 transition-all duration-1000 delay-100 transform ${currentSlide === 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {t.memoriesDesc}
        </p>
        <div className="space-y-4 w-full max-w-2xl">
          {data.memories.map((mem, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl bg-[var(--card)]/50 border border-[var(--border)] backdrop-blur shadow-sm transition-all duration-1000 transform ${currentSlide === 3 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
              style={{ transitionDelay: `${(idx + 2) * 150}ms` }}
            >
              <p className="text-lg leading-relaxed">&ldquo;{mem}&rdquo;</p>
            </div>
          ))}
          {data.memories.length === 0 && (
            <div className={`p-6 rounded-2xl bg-[var(--card)]/50 border border-[var(--border)] text-center italic text-[var(--muted-foreground)] transition-all duration-1000 delay-300 transform ${currentSlide === 3 ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              Bạn chưa có kỷ niệm đặc biệt nào. Hãy viết thêm nhé!
            </div>
          )}
        </div>
      </div>
    ),
    // Slide 5: Finish
    (
      <div key="slide5" className="h-screen w-full flex flex-col items-center justify-center snap-center relative bg-gradient-to-t from-[var(--primary)]/20 to-[var(--background)] px-6">
        <div className={`transition-all duration-1000 transform ${currentSlide === 4 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl md:text-6xl font-heading font-bold text-center mb-6">
            {t.finishTitle}
          </h2>
          <p className="text-xl md:text-2xl text-[var(--foreground)] text-center max-w-lg mx-auto mb-12">
            {t.finishDesc}
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => router.push("/")}
              className="group flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--foreground)] text-[var(--background)] font-semibold text-lg hover:bg-[var(--foreground)]/90 transition-all hover:scale-105"
            >
              {t.backHome}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    )
  ]

  return (
    <div 
      ref={containerRef}
      className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
      
      {/* Progress Indicators */}
      <div className="fixed top-8 left-0 right-0 flex justify-center gap-2 z-50 px-4">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-[var(--foreground)]' : 'w-4 bg-[var(--foreground)]/20'}`}
          />
        ))}
      </div>

      {slides}
    </div>
  )
}
