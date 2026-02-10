import { useMemo } from "react"
import type { TimesheetData, ChargeCode, MonthlyUtilization } from "@/data/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  Plane,
  Building,
  ExternalLink,
} from "lucide-react"

// ── Helpers ──

function daysUntilDue(endDate: string): number {
  const due = new Date(endDate)
  const now = new Date("2026-02-10") // current mock date
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    submitted:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    approved:
      "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    overdue: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  }
  return (
    <Badge className={`text-[10px] font-medium ${styles[status] || ""}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function LocationBadge({
  location,
  source,
}: {
  location: string
  source: string
}) {
  const Icon = source === "travel-inferred" ? Plane : Building
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
      <Icon className="h-2.5 w-2.5" />
      {location}
      {source === "travel-inferred" && (
        <span className="text-[9px] italic text-indigo-500">(travel)</span>
      )}
    </span>
  )
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    billable: { label: "Billable", className: "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30" },
    pto: { label: "PTO", className: "text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/30" },
    "public-holiday": { label: "Holiday", className: "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30" },
    sick: { label: "Sick", className: "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30" },
    training: { label: "Training", className: "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30" },
  }
  const c = config[type] || { label: type, className: "" }
  return (
    <Badge className={`text-[10px] font-medium ${c.className}`}>
      {c.label}
    </Badge>
  )
}

// ── Utilization bar ──

function UtilBar({
  code,
}: {
  code: ChargeCode
}) {
  const pct = Math.min(100, Math.round((code.usedDays / code.budgetedDays) * 100))
  const remaining = Math.max(0, code.budgetedDays - code.usedDays)
  const isInternal = code.budgetedDays >= 999
  const isHigh = pct >= 80

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">{code.clientName}</p>
          <p className="truncate text-[10px] text-muted-foreground">
            {code.code} · {code.engagementName}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {isInternal ? (
            <p className="text-[10px] text-muted-foreground">
              {code.usedDays}d used
            </p>
          ) : (
            <>
              <p className={`text-xs font-semibold ${isHigh ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {remaining}d remaining
              </p>
              <p className="text-[10px] text-muted-foreground">
                {code.usedDays}/{code.budgetedDays}d ({pct}%)
              </p>
            </>
          )}
        </div>
      </div>
      {!isInternal && (
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: isHigh ? "#f59e0b" : code.colorAccent,
            }}
          />
        </div>
      )}
    </div>
  )
}

// ── 12-month utilization chart ──

function formatMonth3(monthStr: string): string {
  const d = new Date(monthStr + "-01T12:00:00")
  return d.toLocaleDateString("en-US", { month: "short" })
}

function UtilizationChart({
  data,
}: {
  data: MonthlyUtilization[]
}) {
  const maxDays = Math.max(...data.map((d) => d.totalWorkingDays))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">Rolling 12-Month Utilization</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            Client
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            Purposeful
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            PTO
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-300" />
            Holiday
          </span>
        </div>
      </div>

      <div className="flex items-end gap-1" style={{ height: 96 }}>
        {data.map((m) => {
          // Client = billableDays (external charge codes)
          // Purposeful (internal) = remaining working days after client + PTO + holiday
          const internalDays = Math.max(
            0,
            m.totalWorkingDays - m.billableDays - m.ptoDays - m.holidayDays
          )
          const clientPct = (m.billableDays / m.totalWorkingDays) * 100
          const internalPct = (internalDays / m.totalWorkingDays) * 100
          const ptoPct = (m.ptoDays / m.totalWorkingDays) * 100
          const holPct = (m.holidayDays / m.totalWorkingDays) * 100
          const barH = (m.totalWorkingDays / maxDays) * 84

          const monthLabel = formatMonth3(m.month)
          const purposefulPct = Math.round(
            ((m.billableDays + internalDays) / m.totalWorkingDays) * 100
          )

          return (
            <div
              key={m.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              {/* Tooltip */}
              <div className="pointer-events-none absolute -top-[4.5rem] left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md border bg-popover px-2.5 py-1.5 text-[10px] shadow-md group-hover:block">
                <p className="font-semibold">{monthLabel}</p>
                <p className="text-indigo-600 dark:text-indigo-400">
                  {m.billableDays}d client ({Math.round(clientPct)}%)
                </p>
                <p className="text-teal-600 dark:text-teal-400">
                  {internalDays}d purposeful ({Math.round(internalPct)}%)
                </p>
                <p className="text-muted-foreground">
                  {m.ptoDays}d PTO · {m.holidayDays}d holiday
                </p>
                <p className="mt-0.5 border-t pt-0.5 font-medium">
                  {purposefulPct}% total utilization
                </p>
              </div>
              {/* Stacked bar — bottom to top: client, purposeful, PTO, holiday, unallocated */}
              <div
                className="flex w-full flex-col-reverse overflow-hidden rounded-sm"
                style={{ height: barH }}
              >
                <div
                  className="w-full bg-indigo-500"
                  style={{ height: `${clientPct}%` }}
                />
                <div
                  className="w-full bg-teal-400"
                  style={{ height: `${internalPct}%` }}
                />
                <div
                  className="w-full bg-purple-400"
                  style={{ height: `${ptoPct}%` }}
                />
                <div
                  className="w-full bg-blue-300"
                  style={{ height: `${holPct}%` }}
                />
              </div>
              <span className="mt-1 text-[9px] text-muted-foreground">
                {monthLabel}
              </span>
            </div>
          )
        })}
      </div>

      {/* Summary row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 rounded-md bg-muted/50 px-3 py-2 text-[10px]">
        {(() => {
          const total = data.reduce((s, m) => s + m.totalWorkingDays, 0)
          const client = data.reduce((s, m) => s + m.billableDays, 0)
          const pto = data.reduce((s, m) => s + m.ptoDays, 0)
          const hol = data.reduce((s, m) => s + m.holidayDays, 0)
          const internal = total - client - pto - hol
          const purposeful = client + internal
          return (
            <>
              <span>
                <strong>{Math.round((client / total) * 100)}%</strong> client
              </span>
              <span>
                <strong>{Math.round((purposeful / total) * 100)}%</strong>{" "}
                purposeful
              </span>
              <span>
                <strong>{client}</strong> client days
              </span>
              <span>
                <strong>{internal}</strong> internal days
              </span>
              <span>
                <strong>{pto}</strong> PTO days
              </span>
            </>
          )
        })()}
      </div>
    </div>
  )
}

// ── Main Component ──

interface TimesheetTrackerProps {
  data: TimesheetData
}

export default function TimesheetTracker({ data }: TimesheetTrackerProps) {
  const daysLeft = daysUntilDue(data.currentPeriod.endDate)
  const { clientUtil, purposefulUtil } = useMemo(() => {
    const total = data.utilization12m.reduce(
      (s, m) => s + m.totalWorkingDays,
      0
    )
    const client = data.utilization12m.reduce((s, m) => s + m.billableDays, 0)
    const pto = data.utilization12m.reduce((s, m) => s + m.ptoDays, 0)
    const hol = data.utilization12m.reduce((s, m) => s + m.holidayDays, 0)
    const internal = total - client - pto - hol
    return {
      clientUtil: total > 0 ? Math.round((client / total) * 100) : 0,
      purposefulUtil: total > 0 ? Math.round(((client + internal) / total) * 100) : 0,
    }
  }, [data.utilization12m])

  return (
    <div className="space-y-4">
      {/* ── Current Period Status ── */}
      <Card className="gap-0 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Current Period</h3>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {data.currentPeriod.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={data.currentPeriod.status} />
            {daysLeft > 0 && daysLeft <= 3 && (
              <Badge className="gap-1 bg-amber-50 text-[10px] text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                <AlertTriangle className="h-2.5 w-2.5" />
                Due in {daysLeft}d
              </Badge>
            )}
          </div>
        </div>

        {/* Period entries */}
        <div className="mt-3 space-y-1">
          <div className="grid grid-cols-[80px_1fr_100px_80px_60px] gap-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Date</span>
            <span>Charge Code</span>
            <span>Location</span>
            <span>Type</span>
            <span className="text-right">Days</span>
          </div>
          {data.currentPeriod.entries.map((entry) => {
            const code = data.chargeCodes.find(
              (c) => c.id === entry.chargeCodeId
            )
            const dateObj = new Date(entry.date + "T12:00:00")
            const dayLabel = dateObj.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })

            return (
              <div
                key={entry.date}
                className="grid grid-cols-[80px_1fr_100px_80px_60px] items-center gap-2 rounded-md px-2 py-1.5 text-xs odd:bg-muted/30"
              >
                <span className="text-[10px] text-muted-foreground">
                  {dayLabel}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: code?.colorAccent || "#94a3b8",
                    }}
                  />
                  <span className="truncate text-[10px] font-medium">
                    {code?.code || entry.chargeCodeId}
                  </span>
                </div>
                <LocationBadge
                  location={entry.location}
                  source={entry.locationSource}
                />
                <TypeBadge type={entry.type} />
                <span className="text-right text-[10px] font-medium">
                  {entry.days}
                </span>
              </div>
            )
          })}
        </div>

        {/* Period summary */}
        <div className="mt-2 flex items-center gap-4 border-t pt-2 text-[10px] text-muted-foreground">
          <span>
            <strong className="text-foreground">
              {data.currentPeriod.totalDays}
            </strong>{" "}
            days logged
          </span>
          <span>
            Standard: <strong className="text-foreground">{data.standardDayHours}h</strong>/day
          </span>
          <span>
            Cadence: <strong className="text-foreground">Semi-monthly</strong> (1st–15th, 16th–end)
          </span>
        </div>
      </Card>

      {/* ── Charge Code Budgets ── */}
      <Card className="gap-0 p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Charge Code Budgets</h3>
          <div className="ml-auto flex gap-1.5">
            <Badge
              variant="secondary"
              className="text-[10px] font-medium"
            >
              {clientUtil}% client
            </Badge>
            <Badge
              variant="secondary"
              className="text-[10px] font-medium"
            >
              {purposefulUtil}% purposeful
            </Badge>
          </div>
        </div>
        <div className="mt-3 space-y-4">
          {data.chargeCodes.map((code) => (
            <UtilBar key={code.id} code={code} />
          ))}
        </div>
      </Card>

      {/* ── 12-Month Utilization ── */}
      <Card className="gap-0 p-4">
        <UtilizationChart
          data={data.utilization12m}
        />
      </Card>

      {/* ── Recent Periods ── */}
      <Card className="gap-0 p-4">
        <h3 className="mb-2 text-xs font-semibold">Recent Periods</h3>
        <div className="space-y-1.5">
          {data.recentPeriods.map((period) => (
            <div
              key={period.id}
              className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
            >
              <span className="text-xs">{period.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">
                  {period.totalDays} days
                </span>
                <StatusBadge status={period.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Notes ── */}
      {data.notes.length > 0 && (
        <Card className="gap-0 p-4">
          <h3 className="mb-2 text-xs font-semibold">Timesheet Notes</h3>
          <div className="space-y-1">
            {data.notes.map((note, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Link to Timesheets Portal ── */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={() =>
          window.open("https://timesheets.firm.example.com", "_blank")
        }
      >
        <ExternalLink className="h-4 w-4" />
        Open Timesheets Portal
      </Button>
    </div>
  )
}
