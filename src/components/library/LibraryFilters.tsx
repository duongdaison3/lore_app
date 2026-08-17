"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations, useFormatter, useLocale } from "next-intl"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Search, X, Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"
import "react-day-picker/dist/style.css"
import { Modal } from "@/components/ui/Modal"

const MOODS = ["😵‍💫", "😐", "🙂", "🥰", "🔥", "🫠"]

export function LibraryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("Library")
  const tc = useTranslations("Common")
  const formatter = useFormatter()
  const locale = useLocale()
  
  const initialQuery = searchParams.get("q") || ""
  const initialMood = searchParams.get("mood") || ""
  const initialDate = searchParams.get("date") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const [mood, setMood] = useState(initialMood)
  const [dateStr, setDateStr] = useState(initialDate)
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialDate ? new Date(initialDate) : undefined
  )

  const applyFilters = (newQ: string, newMood: string, newDate: string) => {
    const params = new URLSearchParams()
    if (newQ) params.set("q", newQ)
    if (newMood) params.set("mood", newMood)
    if (newDate) params.set("date", newDate)
    
    router.push(`/${locale}/library?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters(query, mood, dateStr)
  }

  const handleMoodSelect = (m: string) => {
    const newMood = mood === m ? "" : m
    setMood(newMood)
    applyFilters(query, newMood, dateStr)
  }

  const handleDateSelect = (d: Date | undefined) => {
    setSelectedDate(d)
    const newDateStr = d ? format(d, "yyyy-MM-dd") : ""
    setDateStr(newDateStr)
    setIsCalendarOpen(false)
    applyFilters(query, mood, newDateStr)
  }

  const clearAll = () => {
    setQuery("")
    setMood("")
    setDateStr("")
    setSelectedDate(undefined)
    router.push(`/${locale}/library`)
  }

  return (
    <div className="space-y-4 mb-8">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-5 w-5 text-[var(--muted-foreground)]" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="pl-10 h-12 rounded-full"
          />
        </div>
        <Button type="submit" className="h-12 rounded-full px-6">{t("searchBtn")}</Button>
      </form>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-[var(--card)] p-1 rounded-full border">
          {MOODS.map(m => (
            <button
              key={m}
              onClick={() => handleMoodSelect(m)}
              className={`h-10 w-10 flex items-center justify-center rounded-full text-xl transition-all ${
                mood === m ? "bg-[var(--primary)] text-white scale-110 shadow-sm" : "hover:bg-[var(--muted)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <Button 
          variant={dateStr ? "default" : "outline"}
          className="rounded-full h-12"
          onClick={() => setIsCalendarOpen(true)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateStr ? formatter.dateTime(new Date(dateStr), { dateStyle: 'short' }) : t("pickDate")}
        </Button>

        {(query || mood || dateStr) && (
          <Button variant="ghost" onClick={clearAll} className="rounded-full h-12">
            <X className="mr-2 h-4 w-4" />
            {t("clearFilter")}
          </Button>
        )}
      </div>

      <Modal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
        <div className="p-4 flex justify-center">
          <DayPicker 
            mode="single" 
            selected={selectedDate} 
            onSelect={handleDateSelect} 
          />
        </div>
      </Modal>
    </div>
  )
}
