import type { SwimlaneSummaryData } from "@/data/types"
import { cn } from "@/lib/utils"

interface StatusSummaryProps {
  summary: SwimlaneSummaryData
  className?: string
}

export default function StatusSummary({ summary, className }: StatusSummaryProps) {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="font-medium">{summary.autoCount}</span>
        <span className="text-xs text-muted-foreground">auto</span>
      </span>
      <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span className="font-medium">{summary.heldCount}</span>
        <span className="text-xs text-muted-foreground">held</span>
      </span>
      <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span className="font-medium">{summary.exceptionCount}</span>
        <span className="text-xs text-muted-foreground">exception</span>
      </span>
    </div>
  )
}
