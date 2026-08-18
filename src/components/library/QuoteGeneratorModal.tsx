"use client"

import { useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { toPng } from "html-to-image"
import { Download, Loader2 } from "lucide-react"

interface QuoteGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  quoteText: string
  mood: string
  date: string
}

export function QuoteGeneratorModal({ isOpen, onClose, quoteText, mood, date }: QuoteGeneratorModalProps) {
  const t = useTranslations("Library")
  const quoteRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!quoteRef.current) return
    
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(quoteRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      })
      
      const link = document.createElement("a")
      link.download = `lore-quote-${new Date().getTime()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to generate image", err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center font-heading">{t("generateQuoteTitle")}</DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center p-4">
          <div 
            ref={quoteRef}
            className="w-[350px] h-[350px] rounded-3xl overflow-hidden relative flex flex-col justify-between p-8"
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              color: "var(--primary-foreground)"
            }}
          >
            {/* Ambient blur effects */}
            <div className="absolute top-[-20%] left-[-20%] w-full h-full bg-white/20 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-full h-full bg-black/10 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <div className="text-4xl mb-4">{mood}</div>
              <p className="font-heading text-xl md:text-2xl font-medium leading-snug line-clamp-6" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                &ldquo;{quoteText}&rdquo;
              </p>
            </div>
            
            <div className="relative z-10 flex justify-between items-end opacity-90">
              <span className="font-bold tracking-widest text-sm uppercase">Lore.</span>
              <span className="text-xs font-medium bg-black/10 px-2 py-1 rounded-md backdrop-blur-sm">{date}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-2">
          <Button 
            onClick={handleDownload} 
            disabled={isGenerating}
            className="w-full sm:w-auto rounded-full px-8 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground)]/90"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            {t("downloadQuote")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
