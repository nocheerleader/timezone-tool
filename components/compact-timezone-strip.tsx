"use client"

import { useState, useEffect } from "react"

interface TimezoneOption {
  city: string
  timezone: string
  country: string
  flag: string
  offset: string
}

interface CompactTimezoneStripProps {
  timezones: TimezoneOption[]
  is24HourFormat: boolean
}

export default function CompactTimezoneStrip({ timezones, is24HourFormat }: CompactTimezoneStripProps) {
  const [times, setTimes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: { [key: string]: string } = {}

      timezones.forEach((tz) => {
        const now = new Date()
        const timeString = now.toLocaleTimeString("en-US", {
          timeZone: tz.timezone,
          hour12: !is24HourFormat,
          hour: "2-digit",
          minute: "2-digit",
        })
        newTimes[tz.timezone] = timeString
      })

      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)

    return () => clearInterval(interval)
  }, [timezones, is24HourFormat])

  const getWorkHoursStatus = (timezone: string) => {
    const now = new Date()
    const hour = Number.parseInt(
      now.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: false,
        hour: "2-digit",
      }),
    )

    if (hour >= 9 && hour < 17) return "business"
    if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 20)) return "early-late"
    return "night"
  }

  const statusColors = {
    business: "bg-green-500",
    "early-late": "bg-yellow-500",
    night: "bg-red-500",
  }

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-6 mx-auto max-w-6xl">
      <div className="flex flex-wrap gap-6 justify-center items-center">
        {timezones.map((tz) => {
          const workStatus = getWorkHoursStatus(tz.timezone)
          return (
            <div
              key={tz.timezone}
              className="flex items-center gap-3 min-w-[140px] group hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg" role="img" aria-label={`${tz.country} flag`}>
                  {tz.flag}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${statusColors[workStatus]}`}
                  title={
                    workStatus === "business"
                      ? "Business hours"
                      : workStatus === "early-late"
                        ? "Early/Late hours"
                        : "Night hours"
                  }
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 mb-1">{tz.city}</div>
                <div className="text-lg font-mono font-semibold text-gray-800">{times[tz.timezone] || "--:--"}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
