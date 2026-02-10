import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface TimeIndicatorProps {
  timeAgo: string
  minutesAgo: number
  className?: string
}

export default function TimeIndicator({
  timeAgo,
  minutesAgo,
  className,
}: TimeIndicatorProps) {
  const colorClass =
    minutesAgo >= 240
      ? "text-red-600"
      : minutesAgo >= 120
        ? "text-amber-600"
        : "text-muted-foreground"

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", colorClass, className)}>
      <Clock className="h-3 w-3" />
      {timeAgo}
    </span>
  )
}
