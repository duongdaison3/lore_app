"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/Button"

export function OnboardingCarousel() {
  const t = useTranslations("Onboarding")
  const [step, setStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    setMounted(true)
    const hasSeen = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeen) {
      setShow(true)
    }
  }, [])

  if (!mounted || !show) return null

  const handleFinish = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setShow(false)
  }

  const steps = [
    {
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: (
        <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center animate-pulse duration-3000">
          <svg className="w-16 h-16 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      )
    },
    {
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: (
        <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[var(--accent)]/20 to-[var(--primary)]/20 flex items-center justify-center animate-pulse duration-3000">
          <svg className="w-16 h-16 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      )
    },
    {
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: (
        <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[var(--primary)]/10 to-[var(--foreground)]/10 flex items-center justify-center animate-pulse duration-3000">
          <svg className="w-16 h-16 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      )
    }
  ]

  const isLast = step === steps.length - 1

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] overflow-hidden">
      
      {/* Ambient background blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--primary)]/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse duration-5000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--accent)]/20 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse duration-7000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
        
        {/* Skip button */}
        <button 
          onClick={handleFinish}
          className="absolute top-8 right-8 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors z-20"
        >
          {t("skip")}
        </button>

        {/* Carousel Content */}
        <div className="relative w-full h-[400px] flex items-center justify-center">
          {steps.map((s, i) => (
            <div 
              key={i}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-out transform ${
                i === step ? 'opacity-100 translate-x-0' : 
                i < step ? 'opacity-0 -translate-x-full scale-95' : 'opacity-0 translate-x-full scale-95'
              }`}
            >
              <div className="mb-12 drop-shadow-xl">{s.icon}</div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-[var(--foreground)] mb-4">{s.title}</h2>
              <p className="text-lg text-[var(--muted-foreground)] max-w-sm mx-auto leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="mt-12 flex flex-col items-center space-y-8 w-full">
          {/* Dots */}
          <div className="flex space-x-3">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-[var(--primary)]' : 'w-2.5 bg-[var(--border)]'}`}
              />
            ))}
          </div>

          <Button 
            onClick={() => {
              if (isLast) {
                handleFinish()
              } else {
                setStep(s => s + 1)
              }
            }}
            className="w-full sm:w-2/3 h-14 rounded-full text-lg font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all bg-[var(--primary)] text-[var(--primary-foreground)]"
          >
            {isLast ? t("start") : t("next")}
          </Button>
        </div>

      </div>
    </div>
  )
}
