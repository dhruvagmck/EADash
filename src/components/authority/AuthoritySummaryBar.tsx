import type { AuthorityRule } from "@/data/types"
import { AlertTriangle } from "lucide-react"

interface AuthoritySummaryBarProps {
  rules: AuthorityRule[]
  lastReviewed: string
  lastReviewedDays?: number
}

export default function AuthoritySummaryBar({
  rules,
  lastReviewed,
  lastReviewedDays = 3,
}: AuthoritySummaryBarProps) {
  const canCount = rules.filter((r) => r.level === "CAN").length
  const shouldCount = rules.filter((r) => r.level === "SHOULD").length
  const cannotCount = rules.filter((r) => r.level === "CANNOT").length
  const total = rules.length

  const canPct = total ? (canCount / total) * 100 : 0
  const shouldPct = total ? (shouldCount / total) * 100 : 0
  const cannotPct = total ? (cannotCount / total) * 100 : 0

  // Override rate
  const rulesWithOverrides = rules.filter((r) => r.overrideHistory.length > 0)
  const overrideActions = rulesWithOverrides.flatMap((r) => r.overrideHistory)
  const totalActions = overrideActions.length
  const overriddenActions = overrideActions.filter(
    (o) => o.result === "modified" || o.result === "rejected"
  ).length
  const overrideRate = totalActions
    ? Math.round((overriddenActions / totalActions) * 100)
    : 0

  const isStale = lastReviewedDays > 90

  return (
    <div className="rounded-lg border bg-card p-4">
      {/* Staleness warning */}
      {isStale && (
        <div className="mb-3 flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 dark:border-amber-700 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-800 dark:text-amber-300">
            This profile hasn't been reviewed in over 90 days. Consider
            reviewing to ensure rules are still appropriate.
          </p>
        </div>
      )}

      {/* Stacked bar */}
      <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="bg-green-500 transition-all"
          style={{ width: `${canPct}%` }}
        />
        <div
          className="bg-amber-400 transition-all"
          style={{ width: `${shouldPct}%` }}
        />
        <div
          className="bg-red-500 transition-all"
          style={{ width: `${cannotPct}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="font-medium text-green-700 dark:text-green-400">
            {canCount}
          </span>
          <span className="text-muted-foreground">CAN</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="font-medium text-amber-700 dark:text-amber-400">
            {shouldCount}
          </span>
          <span className="text-muted-foreground">SHOULD</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="font-medium text-red-700 dark:text-red-400">
            {cannotCount}
          </span>
          <span className="text-muted-foreground">CANNOT</span>
        </div>

        <span className="mx-2 h-4 w-px bg-border" />

        <div className="text-muted-foreground">
          Last reviewed:{" "}
          <span className="font-medium text-foreground">{lastReviewed}</span>
        </div>

        <div className="text-muted-foreground">
          Active rules:{" "}
          <span className="font-medium text-foreground">
            {total} across{" "}
            {new Set(rules.map((r) => r.domain)).size} domains
          </span>
        </div>

        <div className="text-muted-foreground">
          Override rate:{" "}
          <span className="font-medium text-foreground">{overrideRate}%</span>
        </div>
      </div>
    </div>
  )
}
