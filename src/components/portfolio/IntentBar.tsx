import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Shield, Clock, SlidersHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Severity, Domain } from "@/data/types"
import { DOMAIN_CONFIG } from "@/lib/constants"

export type FocusMode =
  | "all"
  | "client-facing"
  | "internal"
  | "travel-expenses"
  | "custom"

const FOCUS_MODES: { id: FocusMode; label: string }[] = [
  { id: "all", label: "All" },
  { id: "client-facing", label: "Client-Facing" },
  { id: "internal", label: "Internal" },
  { id: "travel-expenses", label: "Travel & Expenses" },
  { id: "custom", label: "Custom" },
]

const ALL_DOMAINS: Domain[] = [
  "client-facing",
  "internal-scheduling",
  "travel-expenses",
  "timesheets",
  "email-triage",
]

interface IntentBarProps {
  urgentCount: number
  reviewCount: number
  runningCount: number
  activeMode: FocusMode
  onModeChange: (mode: FocusMode) => void
  activeSeverityFilter: Severity | null
  onSeverityFilter: (severity: Severity | null) => void
  protectedWindow: boolean
  onProtectedWindowChange: (val: boolean) => void
  customDomains: Domain[]
  onCustomDomainsChange: (domains: Domain[]) => void
}

export default function IntentBar({
  urgentCount,
  reviewCount,
  runningCount,
  activeMode,
  onModeChange,
  activeSeverityFilter,
  onSeverityFilter,
  protectedWindow,
  onProtectedWindowChange,
  customDomains,
  onCustomDomainsChange,
}: IntentBarProps) {
  const [protectedEndTime, setProtectedEndTime] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState("")
  const [protectedHours, setProtectedHours] = useState(2)
  const [customPickerOpen, setCustomPickerOpen] = useState(false)

  const startProtectedWindow = useCallback(
    (hours: number) => {
      const end = new Date(Date.now() + hours * 60 * 60 * 1000)
      setProtectedEndTime(end)
      onProtectedWindowChange(true)
    },
    [onProtectedWindowChange]
  )

  const stopProtectedWindow = useCallback(() => {
    setProtectedEndTime(null)
    setCountdown("")
    onProtectedWindowChange(false)
  }, [onProtectedWindowChange])

  useEffect(() => {
    if (!protectedEndTime) return
    const interval = setInterval(() => {
      const diff = protectedEndTime.getTime() - Date.now()
      if (diff <= 0) {
        stopProtectedWindow()
        return
      }
      const hrs = Math.floor(diff / 3600000)
      const mins = Math.floor((diff % 3600000) / 60000)
      setCountdown(
        hrs > 0 ? `${hrs}h ${mins}m remaining` : `${mins}m remaining`
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [protectedEndTime, stopProtectedWindow])

  const handleProtectedToggle = (checked: boolean) => {
    if (checked) {
      startProtectedWindow(protectedHours)
    } else {
      stopProtectedWindow()
    }
  }

  const handleCustomModeClick = () => {
    onModeChange("custom")
    setCustomPickerOpen(true)
  }

  const toggleCustomDomain = (domain: Domain) => {
    const next = customDomains.includes(domain)
      ? customDomains.filter((d) => d !== domain)
      : [...customDomains, domain]
    onCustomDomainsChange(next)
  }

  const severityPills: {
    severity: Severity | null
    count: number
    label: string
    colors: string
  }[] = [
    {
      severity: "urgent",
      count: urgentCount,
      label: "Urgent",
      colors:
        "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900",
    },
    {
      severity: "review",
      count: reviewCount,
      label: "Review",
      colors:
        "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900",
    },
    {
      severity: "running",
      count: runningCount,
      label: "Running",
      colors:
        "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950 dark:text-green-400 dark:hover:bg-green-900",
    },
  ]

  return (
    <div className="shrink-0 space-y-0 border-b bg-muted/50">
      {/* Main controls row — wraps on narrow screens */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-3">
        {/* Focus Mode Selector */}
        <div className="flex items-center gap-1 rounded-lg border bg-card p-0.5">
          {FOCUS_MODES.map((mode) =>
            mode.id === "custom" ? (
              <button
                key={mode.id}
                onClick={handleCustomModeClick}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  activeMode === mode.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="h-3 w-3" />
                {mode.label}
              </button>
            ) : (
              <button
                key={mode.id}
                onClick={() => {
                  onModeChange(mode.id)
                  setCustomPickerOpen(false)
                }}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  activeMode === mode.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode.label}
              </button>
            )
          )}
        </div>

        {/* Priority Bands — clickable to filter */}
        <div className="flex items-center gap-2">
          {severityPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() =>
                onSeverityFilter(
                  activeSeverityFilter === pill.severity ? null : pill.severity
                )
              }
            >
              <Badge
                className={cn(
                  "cursor-pointer rounded-full transition-all",
                  pill.colors,
                  activeSeverityFilter === pill.severity &&
                    "ring-2 ring-ring ring-offset-1"
                )}
              >
                <span className="mr-1 font-bold">{pill.count}</span>{" "}
                {pill.label}
              </Badge>
            </button>
          ))}
          {activeSeverityFilter && (
            <button
              onClick={() => onSeverityFilter(null)}
              className="text-[11px] text-muted-foreground underline hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Protected Window — pushed right */}
        <div className="ml-auto flex items-center gap-2">
          <Shield
            className={cn(
              "h-4 w-4 shrink-0",
              protectedWindow ? "text-amber-500" : "text-muted-foreground"
            )}
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">Protected</span>
          {!protectedWindow && (
            <Input
              type="number"
              min={1}
              max={8}
              value={protectedHours}
              onChange={(e) => setProtectedHours(Number(e.target.value) || 2)}
              className="h-6 w-12 px-1.5 text-center text-xs"
            />
          )}
          {!protectedWindow && (
            <span className="text-[11px] text-muted-foreground">hrs</span>
          )}
          <Switch
            checked={protectedWindow}
            onCheckedChange={handleProtectedToggle}
            className="data-[state=checked]:bg-amber-500"
          />
          {protectedWindow && countdown && (
            <span className="flex items-center gap-1 text-xs font-medium whitespace-nowrap text-amber-600 dark:text-amber-400">
              <Clock className="h-3 w-3 shrink-0" />
              {countdown}
            </span>
          )}
        </div>
      </div>

      {/* Protected window banner */}
      {protectedWindow && (
        <div className="flex items-center gap-2 border-t bg-amber-50 px-6 py-2 dark:bg-amber-950/50">
          <Shield className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Protected window active — only urgent items shown.
          </span>
        </div>
      )}

      {/* Custom domain picker */}
      {activeMode === "custom" && customPickerOpen && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-6 py-2.5">
          <span className="text-xs font-medium text-muted-foreground">
            Domains:
          </span>
          {ALL_DOMAINS.map((domain) => {
            const config = DOMAIN_CONFIG[domain]
            return (
              <label
                key={domain}
                className="flex cursor-pointer items-center gap-1.5"
              >
                <Checkbox
                  checked={customDomains.includes(domain)}
                  onCheckedChange={() => toggleCustomDomain(domain)}
                />
                <config.icon
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: config.color }}
                />
                <span className="text-xs whitespace-nowrap">{config.label}</span>
              </label>
            )
          })}
          <button
            onClick={() => setCustomPickerOpen(false)}
            className="ml-auto text-[11px] text-muted-foreground underline hover:text-foreground"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
