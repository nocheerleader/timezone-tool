"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"

interface TimezoneOption {
  city: string
  timezone: string
  country: string
  flag: string
  offset: string
}

interface TimeCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  baseTimezone: TimezoneOption
  allTimezones: TimezoneOption[]
  is24HourFormat: boolean
}

export default function TimeCalculatorModal({
  isOpen,
  onClose,
  baseTimezone,
  allTimezones,
  is24HourFormat,
}: TimeCalculatorModalProps) {
  const [selectedTime, setSelectedTime] = useState("14:00")
  const [selectedDate, setSelectedDate] = useState("")
  const [calculatedTimes, setCalculatedTimes] = useState<
    Array<{
      timezone: TimezoneOption
      time: string
      date: string
      isGoodTime: boolean
      status: "business" | "early-late" | "night"
    }>
  >([])

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split("T")[0]
    setSelectedDate(today)
  }, [])

  useEffect(() => {
    if (selectedTime && selectedDate) {
      calculateTimes()
    }
  }, [selectedTime, selectedDate, baseTimezone, allTimezones, is24HourFormat])

  const calculateTimes = () => {
    const baseDateTime = new Date(`${selectedDate}T${selectedTime}:00`)

    // Create a date in the base timezone
    const baseDateTimeString = baseDateTime.toLocaleString("en-CA", {
      timeZone: baseTimezone.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    const [datePart, timePart] = baseDateTimeString.split(", ")
    const baseUTCTime = new Date(`${datePart}T${timePart}`)

    const results = allTimezones.map((tz) => {
      const localTime = new Date(baseUTCTime.toLocaleString("en-US", { timeZone: tz.timezone }))

      const timeString = localTime.toLocaleTimeString("en-US", {
        hour12: !is24HourFormat,
        hour: "2-digit",
        minute: "2-digit",
      })

      const dateString = localTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })

      const hour = localTime.getHours()
      let status: "business" | "early-late" | "night"
      let isGoodTime = false

      if (hour >= 9 && hour < 17) {
        status = "business"
        isGoodTime = true
      } else if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 20)) {
        status = "early-late"
        isGoodTime = false
      } else {
        status = "night"
        isGoodTime = false
      }

      return {
        timezone: tz,
        time: timeString,
        date: dateString,
        isGoodTime,
        status,
      }
    })

    setCalculatedTimes(results)
  }

  const getStatusDot = (status: string) => {
    switch (status) {
      case "business":
        return "bg-green-500"
      case "early-late":
        return "bg-yellow-500"
      case "night":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "business":
        return "Good time"
      case "early-late":
        return "Early/Late"
      case "night":
        return "Night time"
      default:
        return "Unknown"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-white to-gray-50">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            Meeting Time Calculator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{baseTimezone.flag}</span>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Planning from {baseTimezone.city}</h3>
                <p className="text-sm text-gray-600">{baseTimezone.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-sm font-medium text-gray-700 mb-2 block">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">Meeting times for everyone</h4>
            <div className="space-y-3">
              {calculatedTimes.map((result) => (
                <div
                  key={result.timezone.timezone}
                  className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    {/* Left side - Location info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{result.timezone.flag}</span>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 text-lg leading-tight">
                            {result.timezone.city}
                          </div>
                          <div className="text-sm text-gray-600">{result.timezone.country}</div>
                        </div>
                      </div>
                    </div>

                    {/* Center - Time info */}
                    <div className="text-center flex-1">
                      <div className="font-mono font-bold text-2xl text-gray-900">{result.time}</div>
                      <div className="text-sm text-gray-600">{result.date}</div>
                    </div>

                    {/* Right side - Status */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusDot(result.status)}`}
                        title={getStatusLabel(result.status)}
                      />
                      <span className="text-sm font-medium text-gray-700 min-w-[80px] text-right">
                        {getStatusLabel(result.status)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <Button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
