"use client"

import { useState } from "react"
import TimezoneCard from "@/components/timezone-card"
import CompactTimezoneStrip from "@/components/compact-timezone-strip"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Minus, ChevronDown, ChevronUp } from "lucide-react"

const availableTimezones = [
  { city: "New York", timezone: "America/New_York", country: "United States", flag: "🇺🇸", offset: "UTC-5" },
  { city: "Los Angeles", timezone: "America/Los_Angeles", country: "United States", flag: "🇺🇸", offset: "UTC-8" },
  { city: "Chicago", timezone: "America/Chicago", country: "United States", flag: "🇺🇸", offset: "UTC-6" },
  { city: "London", timezone: "Europe/London", country: "United Kingdom", flag: "🇬🇧", offset: "UTC+0" },
  { city: "Paris", timezone: "Europe/Paris", country: "France", flag: "🇫🇷", offset: "UTC+1" },
  { city: "Berlin", timezone: "Europe/Berlin", country: "Germany", flag: "🇩🇪", offset: "UTC+1" },
  { city: "Moscow", timezone: "Europe/Moscow", country: "Russia", flag: "🇷🇺", offset: "UTC+3" },
  { city: "Dubai", timezone: "Asia/Dubai", country: "UAE", flag: "🇦🇪", offset: "UTC+4" },
  { city: "Mumbai", timezone: "Asia/Kolkata", country: "India", flag: "🇮🇳", offset: "UTC+5:30" },
  { city: "Singapore", timezone: "Asia/Singapore", country: "Singapore", flag: "🇸🇬", offset: "UTC+8" },
  { city: "Tokyo", timezone: "Asia/Tokyo", country: "Japan", flag: "🇯🇵", offset: "UTC+9" },
  { city: "Sydney", timezone: "Australia/Sydney", country: "Australia", flag: "🇦🇺", offset: "UTC+11" },
  { city: "Auckland", timezone: "Pacific/Auckland", country: "New Zealand", flag: "🇳🇿", offset: "UTC+13" },
  { city: "Guatemala City", timezone: "America/Guatemala", country: "Guatemala", flag: "🇬🇹", offset: "UTC-6" },
  { city: "Cape Town", timezone: "Africa/Johannesburg", country: "South Africa", flag: "🇿🇦", offset: "UTC+2" },
  { city: "Tunis", timezone: "Africa/Tunis", country: "Tunisia", flag: "🇹🇳", offset: "UTC+1" },
  { city: "Dar es Salaam", timezone: "Africa/Dar_es_Salaam", country: "Tanzania", flag: "🇹🇿", offset: "UTC+3" },
]

const defaultTimezones = [
  availableTimezones.find((tz) => tz.timezone === "Europe/London")!,
  availableTimezones.find((tz) => tz.timezone === "America/Guatemala")!,
  availableTimezones.find((tz) => tz.timezone === "Africa/Dar_es_Salaam")!,
  availableTimezones.find((tz) => tz.timezone === "Africa/Tunis")!,
]

export default function Home() {
  const [selectedTimezones, setSelectedTimezones] = useState(defaultTimezones)
  const [isCompactView, setIsCompactView] = useState(false)
  const [is24HourFormat, setIs24HourFormat] = useState(true)
  const [showGuide, setShowGuide] = useState(false)

  const handleTimezoneChange = (cardIndex: number, newTimezone: (typeof availableTimezones)[0]) => {
    setSelectedTimezones((prev) => prev.map((tz, index) => (index === cardIndex ? newTimezone : tz)))
  }

  const addNewTimezone = () => {
    if (selectedTimezones.length >= 12) return

    // Find the first available timezone that's not already selected
    const usedTimezones = selectedTimezones.map((tz) => tz.timezone)
    const availableTimezone = availableTimezones.find((tz) => !usedTimezones.includes(tz.timezone))

    if (availableTimezone) {
      setSelectedTimezones((prev) => [...prev, availableTimezone])
    }
  }

  const removeTimezone = (cardIndex: number) => {
    setSelectedTimezones((prev) => prev.filter((_, index) => index !== cardIndex))
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Make Time Make Sense</h1>
          <p className="text-muted-foreground text-lg mb-4">Real-time local hours for remote teams</p>

          {/* Quick Guide Section */}
          <div className="mb-6">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <span>quick guide</span>
              {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showGuide && (
              <div className="mt-4 p-4 bg-card rounded-lg shadow-sm border border-border max-w-md mx-auto text-left">
                <h3 className="font-semibold text-card-foreground mb-3 text-center">getting started in 30 seconds:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">+</span>
                    <span>
                      <strong className="text-card-foreground">add teammates:</strong> click "add another team mate"
                      below the cards
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive font-semibold">×</span>
                    <span>
                      <strong className="text-card-foreground">remove cards:</strong> click the × on any card you don't
                      need
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-semibold">+</span>
                    <span>
                      <strong className="text-card-foreground">plan meetings:</strong> click the + button to find the
                      best meeting times across all zones
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-2 flex-wrap">
            {/* View Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCompactView(false)}
                variant={!isCompactView ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Cards
              </Button>
              <Button
                onClick={() => setIsCompactView(true)}
                variant={isCompactView ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Minus className="w-4 h-4" />
                Compact
              </Button>
            </div>

            {/* Time Format Toggle */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIs24HourFormat(true)}
                variant={is24HourFormat ? "default" : "outline"}
                size="sm"
                className="font-mono"
              >
                24h
              </Button>
              <Button
                onClick={() => setIs24HourFormat(false)}
                variant={!is24HourFormat ? "default" : "outline"}
                size="sm"
                className="font-mono"
              >
                12h
              </Button>
            </div>
          </div>
        </div>

        {isCompactView ? (
          <CompactTimezoneStrip timezones={selectedTimezones} is24HourFormat={is24HourFormat} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {selectedTimezones.map((timezone, index) => (
              <div key={`${timezone.timezone}-${index}`} className="h-[400px]">
                <TimezoneCard
                  city={timezone.city}
                  timezone={timezone.timezone}
                  country={timezone.country}
                  flag={timezone.flag}
                  offset={timezone.offset}
                  availableTimezones={availableTimezones}
                  allSelectedTimezones={selectedTimezones}
                  is24HourFormat={is24HourFormat}
                  onTimezoneChange={(newTimezone) => handleTimezoneChange(index, newTimezone)}
                  onRemove={() => removeTimezone(index)}
                />
              </div>
            ))}
          </div>
        )}

        {!isCompactView && selectedTimezones.length < 12 && (
          <div className="flex justify-center mt-10">
            <Button
              onClick={addNewTimezone}
              variant="outline"
              className="px-8 py-3 bg-card hover:bg-accent border-2 border-border hover:border-primary text-card-foreground font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              Add Another Team Mate
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-sm text-muted-foreground">
            made with love ❤️ by{" "}
            <a
              href="https://x.com/nocheerleader"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent-foreground font-medium transition-colors duration-200"
            >
              ciara
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
