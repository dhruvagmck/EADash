import type { SwimlaneSummaryData } from "@/data/types"
import { cn } from "@/lib/utils"

interface SwimlaneSummaryProps {
  summary: SwimlaneSummaryData
  className?: string
}

export default function SwimlaneSummary({ summary, className }: SwimlaneSummaryProps) {
  return (
    <div className={cn("flex w-[140px] shrink-0 flex-col justify-center gap-1.5 pl-3 text-xs", className)}>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        <span className="font-semibold text-green-700 dark:text-green-400">{summary.autoCount}</span>
        <span className="text-muted-foreground">auto</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <span className="font-semibold text-amber-700 dark:text-amber-400">{summary.heldCount}</span>
        <span className="text-muted-foreground">held</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        <span className="font-semibold text-red-700 dark:text-red-400">{summary.exceptionCount}</span>
        <span className="text-muted-foreground">exception</span>
      </div>
    </div>
  )
}
