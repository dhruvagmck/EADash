import { cn } from "@/lib/utils"

interface PredictionBadgeProps {
  probability: number // 0.0–1.0
  size?: "sm" | "md"
}

export default function PredictionBadge({
  probability,
  size = "md",
}: PredictionBadgeProps) {
  const pct = Math.round(probability * 100)

  const colorClass =
    pct >= 70
      ? "bg-red-100 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800"
      : pct >= 50
        ? "bg-amber-100 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-800"
        : "bg-blue-100 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-800"

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold ring-1",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs",
        colorClass
      )}
    >
      <svg
        className={cn(
          "shrink-0",
          size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3"
        )}
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray={`${probability * 44} 44`}
          strokeLinecap="round"
          transform="rotate(-90 8 8)"
        />
      </svg>
      {pct}%
    </span>
  )
}
