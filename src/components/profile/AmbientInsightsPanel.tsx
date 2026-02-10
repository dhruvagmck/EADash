import type { AmbientInsight } from "@/data/types"
import AmbientInsightCard from "./AmbientInsightCard"
import { Sparkles, BrainCircuit } from "lucide-react"

interface AmbientInsightsPanelProps {
  insights: AmbientInsight[]
  onAccept?: (id: string) => void
  onDismiss?: (id: string) => void
}

export default function AmbientInsightsPanel({
  insights,
  onAccept,
  onDismiss,
}: AmbientInsightsPanelProps) {
  const activeInsights = insights.filter((i) => i.status === "active")
  const acceptedInsights = insights.filter((i) => i.status === "accepted")

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4 dark:border-indigo-900 dark:from-indigo-950/30 dark:to-violet-950/30">
        <div className="flex items-start gap-3">
          <BrainCircuit className="mt-0.5 h-5 w-5 text-indigo-500" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              Ambient Learning from Communications
            </h3>
            <p className="mt-0.5 text-xs text-indigo-700/70 dark:text-indigo-400/70">
              The system passively observes email, calendar, chat, and expense
              patterns to surface preferences you haven't explicitly documented.
              Accept to convert into preferences or authority rules.
            </p>
          </div>
        </div>
      </div>

      {/* Active insights */}
      {activeInsights.length > 0 ? (
        <div className="space-y-3">
          {activeInsights.map((insight) => (
            <AmbientInsightCard
              key={insight.id}
              insight={insight}
              onAccept={onAccept}
              onDismiss={onDismiss}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <Sparkles className="mb-2 h-6 w-6 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            No new observations
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            The system is learning from communication patterns. New insights will
            appear here as they're detected.
          </p>
        </div>
      )}

      {/* Accepted insights summary */}
      {acceptedInsights.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground">
            {acceptedInsights.length} insight{acceptedInsights.length !== 1 ? "s" : ""} previously accepted
          </p>
          <div className="mt-1.5 space-y-1">
            {acceptedInsights.map((insight) => (
              <p
                key={insight.id}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-green-400" />
                {insight.suggestedAction.description}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
