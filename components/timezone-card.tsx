"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TimeCalculatorModal from "./time-calculator-modal"

interface TimezoneOption {
  city: string
  timezone: string
  country: string
  flag: string
  offset: string
}

interface TimezoneCardProps {
  city: string
  timezone: string
  country: string
  flag: string
  offset: string
  availableTimezones: TimezoneOption[]
  allSelectedTimezones: TimezoneOption[]
  is24HourFormat: boolean
  onTimezoneChange: (timezone: TimezoneOption) => void
  onRemove: () => void
}

export default function TimezoneCard({
  city,
  timezone,
  country,
  flag,
  offset,
  availableTimezones,
  allSelectedTimezones,
  is24HourFormat,
  onTimezoneChange,
  onRemove,
}: TimezoneCardProps) {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: !is24HourFormat,
        hour: "2-digit",
        minute: "2-digit",
      })

      const dateString = now.toLocaleDateString("en-US", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      })

      setTime(timeString)
      setDate(dateString)
      setIsLoaded(true)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [timezone, is24HourFormat])

  // Function to determine work hours status
  const getWorkHoursStatus = () => {
    if (!isLoaded) return "unknown"

    const now = new Date()
    const hour = Number.parseInt(
      now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: false,
        hour: "2-digit",
      }),
    )

    if (hour >= 9 && hour < 17) return "business" // 9 AM - 5 PM
    if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 20)) return "early-late" // 7-9 AM or 5-8 PM
    return "night" // Night hours
  }

  const workStatus = getWorkHoursStatus()
  const statusColors = {
    business: "bg-green-500",
    "early-late": "bg-amber-500",
    night: "bg-red-500",
    unknown: "bg-muted",
  }

  const currentTimezone = { city, timezone, country, flag, offset }

  return (
    <>
      <Card className="bg-card border-border shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 ease-out h-full group border-none cursor-pointer transform-gpu">
        <div className="group-hover:scale-[1.01] group-hover:-translate-y-0.5 transition-transform duration-300 ease-out transform-gpu">
          <CardHeader className="pb-4 relative p-6">
            <button
              onClick={onRemove}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground hover:scale-105 transition-all duration-200 flex items-center justify-center text-muted-foreground text-lg font-medium z-10 transform-gpu"
              aria-label={`Remove ${city} timezone`}
            >
              ×
            </button>
            <Button
              onClick={() => setShowCalculator(true)}
              size="sm"
              className="absolute top-3 right-12 w-7 h-7 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-200 flex items-center justify-center text-primary z-10 p-0 transform-gpu"
              aria-label={`Calculate meeting times from ${city}`}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="text-2xl group-hover:scale-105 transition-transform duration-300 ease-out transform-gpu"
                  role="img"
                  aria-label={`${country} flag`}
                >
                  {flag}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                      {city}
                    </h3>
                    <div
                      className={`w-2 h-2 rounded-full ${statusColors[workStatus]} group-hover:scale-110 transition-transform duration-300 transform-gpu`}
                      title={
                        workStatus === "business"
                          ? "Business hours"
                          : workStatus === "early-late"
                            ? "Early/Late hours"
                            : "Night hours"
                      }
                    />
                  </div>
                  <p className="text-muted-foreground text-sm group-hover:text-muted-foreground/80 transition-colors duration-300">
                    {country}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full font-mono group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                {offset}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center flex-1 pb-6 px-6">
            <div className="text-center space-y-4 w-full">
              <div className="space-y-2">
                <div className="text-4xl font-mono font-semibold text-primary group-hover:scale-102 transition-transform duration-300 ease-out transform-gpu">
                  {isLoaded ? time : "--:--"}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
                  {isLoaded ? date : "Loading..."}
                </div>
              </div>

              <div className="w-full h-px bg-border my-4 group-hover:bg-primary/20 transition-colors duration-300"></div>

              <div className="space-y-3 w-full">
                <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium group-hover:text-primary/70 transition-colors duration-300">
                  Select Time Zone
                </div>
                <Select
                  value={timezone}
                  onValueChange={(value) => {
                    const selectedTimezone = availableTimezones.find((tz) => tz.timezone === value)
                    if (selectedTimezone) {
                      onTimezoneChange(selectedTimezone)
                    }
                  }}
                >
                  <SelectTrigger className="w-full bg-card hover:bg-accent text-card-foreground text-sm border border-border shadow-sm transition-colors duration-200 group-hover:border-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border shadow-lg">
                    {availableTimezones.map((tz) => (
                      <SelectItem key={tz.timezone} value={tz.timezone} className="hover:bg-accent">
                        <div className="flex items-center gap-2">
                          <span>{tz.flag}</span>
                          <span className="text-popover-foreground">{tz.city}</span>
                          <span className="text-muted-foreground text-xs font-mono">({tz.offset})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <TimeCalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        baseTimezone={currentTimezone}
        allTimezones={allSelectedTimezones}
        is24HourFormat={is24HourFormat}
      />
    </>
  )
}
