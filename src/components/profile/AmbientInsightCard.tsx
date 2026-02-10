import type { AmbientInsight, InsightSource } from "@/data/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Mail,
  Calendar,
  MessageSquare,
  Plane,
  Receipt,
  Check,
  X,
  Sparkles,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

const SOURCE_CONFIG: Record<
  InsightSource,
  { icon: typeof Mail; label: string; color: string }
> = {
  email: {
    icon: Mail,
    label: "Email patterns",
    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50",
  },
  calendar: {
    icon: Calendar,
    label: "Calendar patterns",
    color:
      "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/50",
  },
  chat: {
    icon: MessageSquare,
    label: "Chat patterns",
    color:
      "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50",
  },
  "travel-history": {
    icon: Plane,
    label: "Travel history",
    color:
      "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/50",
  },
  "expense-patterns": {
    icon: Receipt,
    label: "Expense patterns",
    color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50",
  },
}

interface AmbientInsightCardProps {
  insight: AmbientInsight
  onAccept?: (id: string) => void
  onDismiss?: (id: string) => void
}

export default function AmbientInsightCard({
  insight,
  onAccept,
  onDismiss,
}: AmbientInsightCardProps) {
  const config = SOURCE_CONFIG[insight.source]
  const SourceIcon = config.icon
  const confidencePct = Math.round(insight.confidence * 100)

  if (insight.status !== "active") return null

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      {/* Header: source + confidence + time */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
            config.color
          )}
        >
          <SourceIcon className="h-3 w-3" />
          {config.label}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {confidencePct}% confident
        </span>

        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {insight.observedOver}
        </span>
      </div>

      {/* Observation */}
      <p className="text-sm font-medium leading-snug">{insight.observation}</p>

      {/* Evidence */}
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        {insight.evidence}
      </p>

      {/* Suggested action */}
      <div className="mt-3 flex items-start gap-2 rounded-md border border-indigo-100 bg-indigo-50/50 px-3 py-2 dark:border-indigo-900 dark:bg-indigo-950/30">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
            Suggested:{" "}
            <span className="font-normal">
              {insight.suggestedAction.description}
            </span>
          </p>
          {insight.suggestedAction.domain && (
            <span className="mt-0.5 inline-block rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400">
              {insight.suggestedAction.type === "preference"
                ? "Update preference"
                : insight.suggestedAction.type === "authority-rule"
                  ? "Create authority rule"
                  : "Add desk note"}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-muted-foreground"
          onClick={() => {
            onDismiss?.(insight.id)
            toast.info("Insight dismissed", {
              description: "Won't show again unless pattern changes",
            })
          }}
        >
          <X className="h-3 w-3" />
          Dismiss
        </Button>
        <Button
          size="sm"
          className="gap-1 bg-indigo-600 text-xs hover:bg-indigo-700"
          onClick={() => {
            onAccept?.(insight.id)
            toast.success("Insight accepted", {
              description: insight.suggestedAction.description,
            })
          }}
        >
          <Check className="h-3 w-3" />
          Accept
        </Button>
      </div>
    </div>
  )
}
