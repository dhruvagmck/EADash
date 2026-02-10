import type { PatternReport } from "@/data/types"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingDown, BarChart3, Gauge, PieChart } from "lucide-react"

interface PatternReportsProps {
  report: PatternReport
}

function MiniBarChart({
  data,
  color,
  maxValue,
}: {
  data: { month: string; value: number }[]
  color: string
  maxValue?: number
}) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value))
  return (
    <div className="flex items-end gap-1.5">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1">
          <div
            className={cn("w-8 rounded-t", color)}
            style={{ height: `${(d.value / max) * 80}px` }}
          />
          <span className="text-[10px] text-muted-foreground">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

function TrustGauge({ value }: { value: number }) {
  const color =
    value >= 70
      ? "text-green-500"
      : value >= 40
        ? "text-amber-500"
        : "text-red-500"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-40 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0 rounded-t-full border-[12px] border-b-0 border-muted" />
        {/* Colored fill */}
        <div
          className={cn(
            "absolute inset-0 rounded-t-full border-[12px] border-b-0",
            value >= 70
              ? "border-green-500"
              : value >= 40
                ? "border-amber-500"
                : "border-red-500"
          )}
          style={{
            clipPath: `polygon(0% 100%, 0% 0%, ${value}% 0%, ${value}% 100%)`,
          }}
        />
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-3xl font-bold", color)}>{value}</span>
        <span className="text-sm text-muted-foreground">/ 100</span>
      </div>
    </div>
  )
}

function AllocationPie({
  allocation,
}: {
  allocation: { orchestration: number; execution: number; review: number }
}) {
  const total = allocation.orchestration + allocation.execution + allocation.review
  const segments = [
    { label: "Orchestration", value: allocation.orchestration, color: "bg-indigo-500" },
    { label: "Execution", value: allocation.execution, color: "bg-amber-400" },
    { label: "Review", value: allocation.review, color: "bg-cyan-500" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-6">
      {/* Pie */}
      <div
        className="h-24 w-24 shrink-0 rounded-full"
        style={{
          background: `conic-gradient(
            #6366f1 0% ${(allocation.orchestration / total) * 100}%,
            #fbbf24 ${(allocation.orchestration / total) * 100}% ${((allocation.orchestration + allocation.execution) / total) * 100}%,
            #06b6d4 ${((allocation.orchestration + allocation.execution) / total) * 100}% 100%
          )`,
        }}
      />
      {/* Legend */}
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm">
            <span className={cn("h-3 w-3 rounded-sm", s.color)} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="font-semibold">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PatternReports({ report }: PatternReportsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Override Rate Trend */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-green-500" />
          <h4 className="text-sm font-semibold">Override Rate Trend</h4>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          % of SHOULD items overridden per month. Declining = authority encoding
          improving.
        </p>
        <MiniBarChart
          data={report.overrideRateTrend}
          color="bg-indigo-500"
          maxValue={40}
        />
      </Card>

      {/* Exception Volume Trend */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-amber-500" />
          <h4 className="text-sm font-semibold">Exception Volume Trend</h4>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Exception count by month. Declining = fewer edge cases.
        </p>
        <MiniBarChart
          data={report.exceptionVolumeTrend}
          color="bg-amber-400"
          maxValue={25}
        />
      </Card>

      {/* Automation Trust Index */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Gauge className="h-4 w-4 text-green-500" />
          <h4 className="text-sm font-semibold">Automation Trust Index</h4>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Composite score based on CAN/SHOULD ratio, override rate, and
          exception frequency.
        </p>
        <TrustGauge value={report.automationTrustIndex} />
      </Card>

      {/* Time Allocation */}
      <Card className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <PieChart className="h-4 w-4 text-indigo-500" />
          <h4 className="text-sm font-semibold">Time Allocation</h4>
        </div>
        <p className="mb-4 text-xs text-muted-foreground">
          Estimated EA time split. Goal: orchestration share growing over time.
        </p>
        <AllocationPie allocation={report.timeAllocation} />
      </Card>
    </div>
  )
}
