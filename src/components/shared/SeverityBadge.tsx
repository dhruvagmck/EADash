import { SEVERITY_STYLES, EXCEPTION_SEVERITY_STYLES } from "@/lib/constants"
import type { Severity, ExceptionSeverity } from "@/data/types"
import { cn } from "@/lib/utils"

interface SeverityBadgeProps {
  severity: Severity | ExceptionSeverity
  className?: string
}

const SEVERITY_LABELS: Record<Severity, string> = {
  urgent: "Urgent",
  review: "Review",
  running: "Running",
  clear: "Clear",
}

export default function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  // Exception severity (P1, P2, P3)
  if (severity === "P1" || severity === "P2" || severity === "P3") {
    const style = EXCEPTION_SEVERITY_STYLES[severity]
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
          style.bg,
          style.text,
          style.border,
          className
        )}
      >
        {severity}
      </span>
    )
  }

  // Signal severity
  const style = SEVERITY_STYLES[severity as Severity]
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {SEVERITY_LABELS[severity as Severity]}
    </span>
  )
}
