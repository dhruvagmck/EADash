import type { SwimlaneSummaryData } from "@/data/types"
import { cn } from "@/lib/utils"

interface SwimlaneSummaryProps {
  summary: SwimlaneSummaryData
  className?: string
}

export default function SwimlaneSummary({ summary, className }: SwimlaneSummaryProps) {
  return (
    <div className={cn("flex w-[200px] shrink-0 flex-col justify-center gap-2 pl-4", className)}>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-green-700 dark:text-green-400">{summary.autoCount}</span>{" "}
          auto
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500" />
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-amber-700 dark:text-amber-400">{summary.heldCount}</span>{" "}
          held
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-red-700 dark:text-red-400">{summary.exceptionCount}</span>{" "}
          exception
        </span>
      </div>
    </div>
  )
}
